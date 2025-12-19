import { openai } from '@ai-sdk/openai';
import { generateText, streamText } from 'ai';
import { getVectorStore, SearchResult } from './vectorStore';

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

export interface ChatContext {
  messages: ChatMessage[];
  searchResults?: SearchResult[];
}

/**
 * Generate system prompt with portfolio context
 */
function generateSystemPrompt(searchResults: SearchResult[]): string {
  const contextText = searchResults
    .map(result => `[${result.type.toUpperCase()}] ${result.content}`)
    .join('\n\n');

  return `You are an AI assistant for Alex Chen's portfolio website. You help visitors learn about Alex's projects, skills, experience, and background.

CONTEXT INFORMATION:
${contextText}

GUIDELINES:
- Be conversational, helpful, and enthusiastic about Alex's work
- Use the context information to provide accurate, specific answers
- When discussing projects, mention specific technologies and outcomes
- If asked about availability, mention Alex is open to new opportunities
- If you don't know something specific, say so honestly
- Encourage visitors to explore the portfolio or contact Alex directly
- Keep responses concise but informative (2-3 paragraphs max)
- Use a friendly, professional tone that reflects Alex's personality

RESPONSE STYLE:
- Start with a direct answer to the question
- Provide relevant details from the context
- End with a helpful suggestion or call-to-action when appropriate

CONTACT INFORMATION:
- Email: ashwingoyal2006@gmail.com
- LinkedIn: linkedin.com/in/ashwin-goyal-b5b8b8259/
- GitHub: github.com/let-the-dreamers-rise

Remember: You represent Ashwin professionally, so maintain a positive, knowledgeable, and approachable tone.`;
}

/**
 * Generate suggested questions based on portfolio content
 */
export function generateSuggestedQuestions(): string[] {
  return [
    "What's Alex's experience with React and TypeScript?",
    "Tell me about Alex's machine learning projects",
    "What makes Alex different from other developers?",
    "Show me Alex's most impressive project",
    "What technologies does Alex specialize in?",
    "Is Alex available for new opportunities?",
    "What's Alex's background in AI and machine learning?",
    "Can you show me examples of Alex's frontend work?",
  ];
}

/**
 * Generate a chat response using AI
 */
export async function generateChatResponse(
  message: string,
  context: ChatContext = { messages: [] }
): Promise<{ response: string; searchResults: SearchResult[] }> {
  try {
    // Search for relevant content
    const vectorStore = getVectorStore();
    await vectorStore.initialize();
    
    const searchResults = await vectorStore.search(message, 5, 0.6);
    
    // Generate system prompt with context
    const systemPrompt = generateSystemPrompt(searchResults);
    
    // Prepare conversation history
    const messages = [
      { role: 'system' as const, content: systemPrompt },
      ...context.messages.slice(-6).map(msg => ({
        role: msg.role as 'user' | 'assistant',
        content: msg.content,
      })),
      { role: 'user' as const, content: message },
    ];

    // Generate response
    const { text } = await generateText({
      model: openai('gpt-4o-mini'),
      messages,
      temperature: 0.7,
      maxTokens: 500,
    });

    return {
      response: text,
      searchResults,
    };
  } catch (error) {
    console.error('Error generating chat response:', error);
    
    // Fallback response
    return {
      response: "I'm sorry, I'm having trouble processing your request right now. Please try again or feel free to contact Ashwin directly at ashwingoyal2006@gmail.com.",
      searchResults: [],
    };
  }
}

/**
 * Generate a streaming chat response
 */
export async function generateStreamingChatResponse(
  message: string,
  context: ChatContext = { messages: [] }
) {
  try {
    // Search for relevant content
    const vectorStore = getVectorStore();
    await vectorStore.initialize();
    
    const searchResults = await vectorStore.search(message, 5, 0.6);
    
    // Generate system prompt with context
    const systemPrompt = generateSystemPrompt(searchResults);
    
    // Prepare conversation history
    const messages = [
      { role: 'system' as const, content: systemPrompt },
      ...context.messages.slice(-6).map(msg => ({
        role: msg.role as 'user' | 'assistant',
        content: msg.content,
      })),
      { role: 'user' as const, content: message },
    ];

    // Generate streaming response
    const result = await streamText({
      model: openai('gpt-4o-mini'),
      messages,
      temperature: 0.7,
      maxTokens: 500,
    });

    return result.toAIStreamResponse();
  } catch (error) {
    console.error('Error generating streaming chat response:', error);
    throw error;
  }
}

/**
 * Analyze user intent and suggest follow-up questions
 */
export function analyzeUserIntent(message: string): {
  intent: string;
  followUpQuestions: string[];
} {
  const lowerMessage = message.toLowerCase();
  
  if (lowerMessage.includes('project') || lowerMessage.includes('work') || lowerMessage.includes('portfolio')) {
    return {
      intent: 'projects',
      followUpQuestions: [
        "Would you like to see a specific type of project?",
        "Are you interested in the technical details?",
        "Would you like to see the live demo or code?",
      ],
    };
  }
  
  if (lowerMessage.includes('skill') || lowerMessage.includes('technology') || lowerMessage.includes('experience')) {
    return {
      intent: 'skills',
      followUpQuestions: [
        "Which technology stack interests you most?",
        "Would you like to know about Alex's learning journey?",
        "Are you curious about specific frameworks or tools?",
      ],
    };
  }
  
  if (lowerMessage.includes('contact') || lowerMessage.includes('hire') || lowerMessage.includes('available')) {
    return {
      intent: 'contact',
      followUpQuestions: [
        "Would you like Alex's contact information?",
        "Are you interested in a specific type of collaboration?",
        "Would you like to know about Alex's availability?",
      ],
    };
  }
  
  if (lowerMessage.includes('about') || lowerMessage.includes('background') || lowerMessage.includes('story')) {
    return {
      intent: 'about',
      followUpQuestions: [
        "Would you like to know about Alex's career journey?",
        "Are you interested in Alex's education background?",
        "Would you like to hear about Alex's interests outside of work?",
      ],
    };
  }
  
  return {
    intent: 'general',
    followUpQuestions: [
      "What would you like to know about Alex?",
      "Are you interested in projects, skills, or experience?",
      "Would you like to see some examples of Alex's work?",
    ],
  };
}