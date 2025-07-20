
"use client";

import { useState, useRef, useEffect, FormEvent } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Bot, Send, X, User } from "lucide-react";
import { cn } from "@/lib/utils";
import { Avatar, AvatarFallback } from "./ui/avatar";
import { usePathname } from 'next/navigation';

type Message = {
  id: string;
  role: "user" | "assistant";
  text: string;
};

const mockUser = {
  name: "Karim Ben Ahmed",
};

const examplePrompts = [
    "What services do you offer?",
    "How much is an oil change?",
    "What are your hours?",
];

export function AIChat() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    { id: '1', role: 'assistant', text: "Hello! I'm the Max Drive assistant. How can I help you today?" }
  ]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userName, setUserName] = useState('');

  const pathname = usePathname();
  const scrollAreaViewportRef = useRef<HTMLDivElement>(null);
  
  const isDashboardPage = pathname.startsWith('/admin') || pathname.startsWith('/dashboard');

  useEffect(() => {
    const userRole = localStorage.getItem('userRole');
    if (userRole) {
      setIsLoggedIn(true);
      setUserName(mockUser.name);
    }
  }, []);

  useEffect(() => {
    if (isOpen && scrollAreaViewportRef.current) {
      setTimeout(() => {
        scrollAreaViewportRef.current!.scrollTop = scrollAreaViewportRef.current!.scrollHeight;
      }, 100);
    }
  }, [messages, isOpen, isTyping]);

  const sendMessage = (messageText: string) => {
    if (!messageText.trim()) return;

    const userMessage: Message = { id: Date.now().toString(), role: 'user', text: messageText };
    setMessages(prev => [...prev, userMessage]);
    setInput("");
    setIsTyping(true);

    // Mock assistant response
    setTimeout(() => {
        const assistantResponse: Message = { id: (Date.now() + 1).toString(), role: 'assistant', text: "This is a placeholder response." };
        setIsTyping(false);
        setMessages(prev => [...prev, assistantResponse]);
    }, 2000);
  };
  
  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    sendMessage(input);
  };
  
  const handlePromptClick = (prompt: string) => {
    sendMessage(prompt);
  };

  const getAvatarFallback = (name: string): string => {
      if (!name) return "U";
      const nameParts = name.trim().split(" ").filter(Boolean);
      if (nameParts.length > 1) {
          return (nameParts[0][0] + nameParts[nameParts.length - 1][0]).toUpperCase();
      } else if (nameParts.length === 1 && nameParts[0].length > 0) {
          return nameParts[0][0].toUpperCase();
      }
      return "U";
  };
  
  if (isDashboardPage) {
    return null;
  }

  return (
    <>
      <div className="fixed bottom-6 right-6 z-50">
        <Button
          variant="outline"
          size="icon"
          className="h-16 w-16 rounded-full shadow-lg hover:bg-primary hover:text-primary-foreground"
          onClick={() => setIsOpen(true)}
          aria-expanded={isOpen}
        >
          <Bot className="h-8 w-8" />
          <span className="sr-only">Open Chat</span>
        </Button>
      </div>

      <Card
        className={cn(
            "fixed bottom-6 right-6 z-50 w-full max-w-sm shadow-xl rounded-lg flex-col transition-opacity duration-300 ease-in-out",
            isOpen ? "flex" : "hidden"
        )}
      >
        <CardHeader className="flex flex-row items-center justify-between p-4 border-b">
          <div className="flex items-center gap-3">
            <Avatar>
                <AvatarFallback className="bg-primary/10">
                    <Bot className="h-6 w-6 text-primary" />
                </AvatarFallback>
            </Avatar>
            <CardTitle className="text-lg">Max Drive Assistant</CardTitle>
          </div>
          <Button variant="ghost" size="icon" onClick={() => setIsOpen(false)}>
            <X className="h-4 w-4" />
            <span className="sr-only">Close chat</span>
          </Button>
        </CardHeader>
        <CardContent className="p-0 flex-1">
          <ScrollArea className="h-80" viewportRef={scrollAreaViewportRef}>
            <div className="p-4 space-y-4">
              {messages.map((message) => (
                <div key={message.id} className={cn("flex items-end gap-2", {
                  "justify-end": message.role === "user",
                  "justify-start": message.role === "assistant"
                })}>
                  {message.role === 'assistant' && (
                    <Avatar className="h-8 w-8">
                       <AvatarFallback className="bg-primary/10">
                            <Bot className="h-5 w-5 text-primary" />
                        </AvatarFallback>
                    </Avatar>
                  )}
                  <div className={cn("max-w-[75%] rounded-lg px-3 py-2 text-sm", {
                    "bg-primary text-primary-foreground": message.role === "user",
                    "bg-muted": message.role === "assistant"
                  })}>
                    {message.text}
                  </div>
                  {message.role === 'user' && (
                     <Avatar className="h-8 w-8">
                        <AvatarFallback>
                          {isLoggedIn ? getAvatarFallback(userName) : <User className="h-5 w-5" />}
                        </AvatarFallback>
                    </Avatar>
                  )}
                </div>
              ))}
              {isTyping && (
                <div className="flex items-end gap-2 justify-start">
                    <Avatar className="h-8 w-8">
                       <AvatarFallback className="bg-primary/10">
                            <Bot className="h-5 w-5 text-primary" />
                        </AvatarFallback>
                    </Avatar>
                    <div className="max-w-[75%] rounded-lg px-3 py-2 text-sm bg-muted flex items-center space-x-1">
                        <span className="h-2 w-2 bg-muted-foreground/50 rounded-full animate-typing-dot [animation-delay:0s]"></span>
                        <span className="h-2 w-2 bg-muted-foreground/50 rounded-full animate-typing-dot [animation-delay:0.2s]"></span>
                        <span className="h-2 w-2 bg-muted-foreground/50 rounded-full animate-typing-dot [animation-delay:0.4s]"></span>
                    </div>
                </div>
              )}
               {messages.length === 1 && !isTyping && (
                    <div className="space-y-2 pt-4">
                        <p className="text-xs text-center text-muted-foreground">Or try one of these prompts:</p>
                        <div className="flex flex-col gap-2">
                        {examplePrompts.map(prompt => (
                            <Button key={prompt} variant="outline" size="sm" className="h-auto py-2" onClick={() => handlePromptClick(prompt)}>
                                {prompt}
                            </Button>
                        ))}
                        </div>
                    </div>
                )}
            </div>
          </ScrollArea>
        </CardContent>
        <CardFooter className="p-4 border-t">
          <form onSubmit={handleSubmit} className="flex w-full items-center space-x-2">
            <Input
              id="message"
              placeholder="Type your message..."
              className="flex-1"
              autoComplete="off"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              disabled={isTyping}
            />
            <Button type="submit" size="icon" disabled={isTyping || !input.trim()}>
              <Send className="h-4 w-4" />
              <span className="sr-only">Send</span>
            </Button>
          </form>
        </CardFooter>
      </Card>
    </>
  );
}
