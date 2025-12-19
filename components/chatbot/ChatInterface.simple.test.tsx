import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { ChatInterface } from './ChatInterface';

// Mock the chatbot engine
vi.mock('@/lib/chatbot/chatEngine', () => ({
  generateSuggestedQuestions: () => [
    "What's Alex's experience with React?",
    "Tell me about Alex's projects",
    "What technologies does Alex use?",
  ],
}));

// Mock fetch
global.fetch = vi.fn();

describe('ChatInterface Simple Tests', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    (global.fetch as any).mockResolvedValue({
      ok: true,
      json: () => Promise.resolve({
        response: 'Test response from AI',
        searchResults: [],
      }),
    });
  });

  it('should render chat button initially', () => {
    render(<ChatInterface />);
    
    expect(screen.getByRole('button', { name: /open chat/i })).toBeInTheDocument();
    expect(screen.queryByText("Chat with Alex's AI")).not.toBeInTheDocument();
  });

  it('should open chat with welcome message', () => {
    render(<ChatInterface />);
    
    // Click to open chat
    const chatButton = screen.getByRole('button', { name: /open chat/i });
    fireEvent.click(chatButton);
    
    // Chat should be open with welcome message
    expect(screen.getByText("Chat with Alex's AI")).toBeInTheDocument();
    expect(screen.getByText(/Hi! I'm Alex's AI assistant/)).toBeInTheDocument();
  });

  it('should display suggested questions when chat opens', () => {
    render(<ChatInterface />);
    
    // Open chat
    const chatButton = screen.getByRole('button', { name: /open chat/i });
    fireEvent.click(chatButton);
    
    // Should show suggested questions
    expect(screen.getByText('Try asking:')).toBeInTheDocument();
    expect(screen.getByText("What's Alex's experience with React?")).toBeInTheDocument();
  });

  it('should handle message input and sending', async () => {
    render(<ChatInterface />);
    
    // Open chat
    const chatButton = screen.getByRole('button', { name: /open chat/i });
    fireEvent.click(chatButton);
    
    // Find input and send message
    const input = screen.getByPlaceholderText(/Ask about Alex's projects/);
    const sendButton = screen.getByRole('button', { name: /send message/i });
    
    fireEvent.change(input, { target: { value: 'test message' } });
    fireEvent.click(sendButton);
    
    // Should show user message
    await waitFor(() => {
      expect(screen.getByText('test message')).toBeInTheDocument();
    });
  });

  it('should handle chat minimize and restore', () => {
    render(<ChatInterface />);
    
    // Open chat
    const chatButton = screen.getByRole('button', { name: /open chat/i });
    fireEvent.click(chatButton);
    
    // Minimize chat
    const minimizeButton = screen.getByRole('button', { name: /minimize chat/i });
    fireEvent.click(minimizeButton);
    
    // Should still show header but not content
    expect(screen.getByText("Chat with Alex's AI")).toBeInTheDocument();
    expect(screen.queryByText('Try asking:')).not.toBeInTheDocument();
    
    // Restore chat
    const restoreButton = screen.getByRole('button', { name: /restore chat/i });
    fireEvent.click(restoreButton);
    
    // Should show content again
    expect(screen.getByText('Try asking:')).toBeInTheDocument();
  });

  it('should handle chat close functionality', () => {
    render(<ChatInterface />);
    
    // Open chat
    const chatButton = screen.getByRole('button', { name: /open chat/i });
    fireEvent.click(chatButton);
    
    // Close chat
    const closeButton = screen.getByRole('button', { name: /close chat/i });
    fireEvent.click(closeButton);
    
    // Should be closed
    expect(screen.queryByText("Chat with Alex's AI")).not.toBeInTheDocument();
    expect(screen.getByRole('button', { name: /open chat/i })).toBeInTheDocument();
  });

  it('should handle API errors gracefully', async () => {
    (global.fetch as any).mockRejectedValue(new Error('API Error'));
    
    render(<ChatInterface />);
    
    // Open chat
    const chatButton = screen.getByRole('button', { name: /open chat/i });
    fireEvent.click(chatButton);
    
    // Send a message
    const input = screen.getByPlaceholderText(/Ask about Alex's projects/);
    const sendButton = screen.getByRole('button', { name: /send message/i });
    
    fireEvent.change(input, { target: { value: 'test message' } });
    fireEvent.click(sendButton);
    
    // Should show error message
    await waitFor(() => {
      expect(screen.getByText(/I'm sorry, I'm having trouble responding/)).toBeInTheDocument();
    });
  });

  it('should prevent sending empty messages', () => {
    render(<ChatInterface />);
    
    // Open chat
    const chatButton = screen.getByRole('button', { name: /open chat/i });
    fireEvent.click(chatButton);
    
    // Try to send empty message
    const sendButton = screen.getByRole('button', { name: /send message/i });
    fireEvent.click(sendButton);
    
    // Should not call fetch
    expect(global.fetch).not.toHaveBeenCalled();
  });
});
