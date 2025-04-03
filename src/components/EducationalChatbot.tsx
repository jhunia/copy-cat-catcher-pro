
import React, { useState, useRef, useEffect } from 'react';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { ScrollArea } from '@/components/ui/scroll-area';
import { RefreshCw, Send } from 'lucide-react';
import { toast } from 'sonner';
import ChatMessage, { ChatMessageProps } from './ChatMessage';
import { supabase } from '@/integrations/supabase/client';

const EducationalChatbot: React.FC = () => {
  const [messages, setMessages] = useState<ChatMessageProps[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const scrollAreaRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollAreaRef.current) {
      scrollAreaRef.current.scrollTop = scrollAreaRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSendMessage = async () => {
    if (!input.trim()) return;
    
    const userMessage: ChatMessageProps = {
      role: "user",
      content: input.trim()
    };
    
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);
    
    try {
      const apiMessages = messages.concat(userMessage).map(({ role, content }) => ({ 
        role: role === "assistant" ? "assistant" : "user", 
        content 
      }));
      
      const { data, error } = await supabase.functions.invoke('educational-ai', {
        body: { messages: apiMessages }
      });
      
      if (error) {
        console.error("Error from Supabase function:", error);
        throw new Error("Failed to send a request to the Edge Function");
      }
      
      if (data?.message) {
        const assistantMessage: ChatMessageProps = {
          role: "assistant",
          content: data.message.content
        };
        
        setMessages(prev => [...prev, assistantMessage]);
      } else {
        console.error("No message in response:", data);
        throw new Error("Invalid response from AI assistant");
      }
    } catch (error) {
      console.error("Error sending message:", error);
      toast.error("Failed to get response from the educational assistant.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleReset = () => {
    setMessages([]);
    toast.success("Conversation has been reset.");
  };

  return (
    <Card className="w-full max-w-4xl mx-auto shadow-lg border-navy/10 h-[600px] flex flex-col">
      <CardHeader className="bg-navy text-white rounded-t-lg">
        <CardTitle className="text-xl">Educational Assistant</CardTitle>
      </CardHeader>
      
      <CardContent className="flex-1 p-0 relative overflow-hidden">
        <ScrollArea className="h-[450px] p-4" ref={scrollAreaRef}>
          {messages.length === 0 ? (
            <div className="h-full flex items-center justify-center text-center p-4">
              <div className="max-w-md">
                <h3 className="text-lg font-semibold text-navy mb-2">Welcome to Educational Assistant!</h3>
                <p className="text-gray-500 text-sm">
                  Ask me anything about writing papers, citing sources properly, or how to improve your academic writing. 
                  I can help explain concepts and guide you with your educational needs.
                </p>
              </div>
            </div>
          ) : (
            messages.map((message, index) => (
              <ChatMessage key={index} role={message.role} content={message.content} />
            ))
          )}
          
          {isLoading && (
            <div className="flex items-center justify-center py-4">
              <RefreshCw className="animate-spin h-5 w-5 text-navy" />
              <span className="ml-2 text-sm text-gray-500">Thinking...</span>
            </div>
          )}
        </ScrollArea>
      </CardContent>
      
      <CardFooter className="border-t p-3">
        <div className="flex items-end w-full gap-2">
          <Button 
            variant="outline" 
            size="icon" 
            onClick={handleReset}
            title="Reset conversation"
            className="shrink-0"
          >
            <RefreshCw className="h-4 w-4" />
          </Button>
          <Textarea 
            placeholder="Ask the educational assistant..." 
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleInputKeyDown}
            className="min-h-[60px] resize-none"
            disabled={isLoading}
          />
          <Button 
            onClick={handleSendMessage} 
            disabled={isLoading || !input.trim()}
            className="bg-navy hover:bg-navy/90 shrink-0"
          >
            <Send className="h-4 w-4" />
            <span className="sr-only">Send</span>
          </Button>
        </div>
      </CardFooter>
    </Card>
  );
};

export default EducationalChatbot;
