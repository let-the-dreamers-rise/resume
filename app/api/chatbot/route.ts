import { NextRequest, NextResponse } from 'next/server';
import { generateChatResponse, generateStreamingChatResponse, analyzeUserIntent } from '@/lib/chatbot/chatEngine';

// Rate limiting store (in production, use Redis or similar)
const rateLimitStore = new Map<string, { count: number; resetTime: number }>();

// Rate limiting configuration
const RATE_LIMIT_WINDOW = 5 * 60 * 1000; // 5 minutes
const RATE_LIMIT_MAX_REQUESTS = 20; // 20 requests per window

interface ChatRequest {
  message: string;
  messages?: Array<{
    id: string;
    role: 'user' | 'assistant';
    content: string;
    timestamp: string;
  }>;
  stream?: boolean;
}

function checkRateLimit(ip: string): { allowed: boolean; resetTime?: number } {
  const now = Date.now();
  const userLimit = rateLimitStore.get(ip);

  if (!userLimit || now > userLimit.resetTime) {
    // Reset or create new limit
    rateLimitStore.set(ip, {
      count: 1,
      resetTime: now + RATE_LIMIT_WINDOW,
    });
    return { allowed: true };
  }

  if (userLimit.count >= RATE_LIMIT_MAX_REQUESTS) {
    return { allowed: false, resetTime: userLimit.resetTime };
  }

  // Increment count
  userLimit.count += 1;
  rateLimitStore.set(ip, userLimit);
  return { allowed: true };
}

function getClientIP(request: NextRequest): string {
  // Try to get real IP from headers (for production with proxies)
  const forwarded = request.headers.get('x-forwarded-for');
  const realIP = request.headers.get('x-real-ip');
  
  if (forwarded) {
    return forwarded.split(',')[0].trim();
  }
  
  if (realIP) {
    return realIP;
  }
  
  // Fallback to connection IP
  return request.ip || 'unknown';
}

function validateChatRequest(data: any): { isValid: boolean; error?: string } {
  if (!data.message || typeof data.message !== 'string') {
    return { isValid: false, error: 'Message is required and must be a string' };
  }

  if (data.message.trim().length === 0) {
    return { isValid: false, error: 'Message cannot be empty' };
  }

  if (data.message.length > 500) {
    return { isValid: false, error: 'Message is too long (max 500 characters)' };
  }

  if (data.messages && !Array.isArray(data.messages)) {
    return { isValid: false, error: 'Messages must be an array' };
  }

  return { isValid: true };
}

export async function POST(request: NextRequest) {
  try {
    // Get client IP for rate limiting
    const clientIP = getClientIP(request);
    
    // Check rate limit
    const rateLimitResult = checkRateLimit(clientIP);
    if (!rateLimitResult.allowed) {
      const resetTime = rateLimitResult.resetTime || Date.now();
      const resetIn = Math.ceil((resetTime - Date.now()) / 1000 / 60); // minutes
      
      return NextResponse.json(
        { 
          error: 'Too many requests',
          message: `Rate limit exceeded. Please try again in ${resetIn} minutes.`,
        },
        { 
          status: 429,
          headers: {
            'Retry-After': resetIn.toString(),
          },
        }
      );
    }

    // Parse request body
    const body: ChatRequest = await request.json();
    
    // Validate request
    const validation = validateChatRequest(body);
    if (!validation.isValid) {
      return NextResponse.json(
        { error: validation.error },
        { status: 400 }
      );
    }

    // Check if OpenAI API key is configured
    if (!process.env.OPENAI_API_KEY) {
      console.error('OPENAI_API_KEY is not configured');
      return NextResponse.json(
        { 
          error: 'AI service not configured',
          response: "I'm sorry, the AI service is currently unavailable. Please contact Ashwin directly at ashwingoyal2006@gmail.com for any questions.",
        },
        { status: 200 } // Return 200 with fallback message instead of 500
      );
    }

    // Prepare context from previous messages
    const context = {
      messages: (body.messages || []).map(msg => ({
        id: msg.id,
        role: msg.role,
        content: msg.content,
        timestamp: new Date(msg.timestamp),
      })),
    };

    // Check if streaming is requested
    if (body.stream) {
      // Return streaming response
      return await generateStreamingChatResponse(body.message, context);
    }

    // Generate regular response
    const result = await generateChatResponse(body.message, context);
    
    // Analyze user intent for follow-up suggestions
    const intentAnalysis = analyzeUserIntent(body.message);

    // Log successful interaction (in production, use proper logging)
    console.log(`Chatbot interaction from ${clientIP}: "${body.message.substring(0, 50)}..."`);

    return NextResponse.json({
      response: result.response,
      searchResults: result.searchResults,
      intent: intentAnalysis.intent,
      followUpQuestions: intentAnalysis.followUpQuestions,
      timestamp: new Date().toISOString(),
    });

  } catch (error) {
    console.error('Chatbot API error:', error);
    
    // Return a helpful fallback response instead of a generic error
    return NextResponse.json({
      response: "I'm having trouble processing your request right now. Please try rephrasing your question or contact Ashwin directly at ashwingoyal2006@gmail.com.",
      error: 'Processing error',
      timestamp: new Date().toISOString(),
    }, { status: 200 }); // Return 200 with fallback message
  }
}

// Handle streaming requests
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const message = searchParams.get('message');
  
  if (!message) {
    return NextResponse.json(
      { error: 'Message parameter is required' },
      { status: 400 }
    );
  }

  try {
    // Check rate limit
    const clientIP = getClientIP(request);
    const rateLimitResult = checkRateLimit(clientIP);
    
    if (!rateLimitResult.allowed) {
      return NextResponse.json(
        { error: 'Rate limit exceeded' },
        { status: 429 }
      );
    }

    // Return streaming response
    return await generateStreamingChatResponse(message);
  } catch (error) {
    console.error('Streaming chatbot error:', error);
    return NextResponse.json(
      { error: 'Failed to generate streaming response' },
      { status: 500 }
    );
  }
}

// Handle unsupported methods
export async function PUT() {
  return NextResponse.json(
    { error: 'Method not allowed' },
    { status: 405 }
  );
}

export async function DELETE() {
  return NextResponse.json(
    { error: 'Method not allowed' },
    { status: 405 }
  );
}