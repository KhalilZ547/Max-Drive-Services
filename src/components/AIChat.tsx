
"use client";

import { useState, useRef, useEffect, FormEvent } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Bot, Send, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { usePathname } from 'next/navigation';

type Message = {
  id: string;
  role: "user" | "assistant";
  text: string;
};

export function AIChat() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    { id: '1', role: 'assistant', text: "Hello! I'm the garage assistant. How can I help you with your car today?" }
  ]);
  const [input, setInput] = useState("");
  const pathname = usePathname();
  const scrollAreaViewportRef = useRef<HTMLDivElement>(null);
  
  const isDashboardPage = pathname.startsWith('/admin') || pathname.startsWith('/dashboard');

  useEffect(() => {
    if (scrollAreaViewportRef.current) {
      scrollAreaViewportRef.current.scrollTop = scrollAreaViewportRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    const userMessage: Message = { id: Date.now().toString(), role: 'user', text: input };
    setMessages(prev => [...prev, userMessage]);
    setInput("");

    // Mock assistant response
    setTimeout(() => {
        const assistantResponse: Message = { id: (Date.now() + 1).toString(), role: 'assistant', text: "This is a placeholder response." };
        setMessages(prev => [...prev, assistantResponse]);
    }, 1000);
  };
  
  if (isDashboardPage) {
    return null;
  }

  return (
    <>
      <div className={cn("fixed bottom-6 right-6 z-50 transition-transform duration-300 ease-in-out", {
        "scale-0 opacity-0": isOpen,
        "scale-100 opacity-100": !isOpen
      })}>
        <Button
          size="icon"
          className="h-16 w-16 rounded-full shadow-lg"
          onClick={() => setIsOpen(true)}
        >
          <Bot className="h-8 w-8" />
          <span className="sr-only">Open Chat</span>
        </Button>
      </div>

      <Card className={cn("fixed bottom-6 right-6 z-50 w-full max-w-sm transform-gpu transition-all duration-300 ease-in-out shadow-xl", {
        "translate-y-0 opacity-100": isOpen,
        "translate-y-16 opacity-0 pointer-events-none": !isOpen,
      })}>
        <CardHeader className="flex flex-row items-center justify-between p-4 border-b">
          <div className="flex items-center gap-3">
            <Avatar>
                <AvatarFallback>GA</AvatarFallback>
            </Avatar>
            <CardTitle className="text-lg">Garage Assistant</CardTitle>
          </div>
          <Button variant="ghost" size="icon" onClick={() => setIsOpen(false)}>
            <X className="h-4 w-4" />
            <span className="sr-only">Close chat</span>
          </Button>
        </CardHeader>
        <CardContent className="p-0">
          <ScrollArea className="h-80" viewportRef={scrollAreaViewportRef}>
            <div className="p-4 space-y-4">
              {messages.map((message) => (
                <div key={message.id} className={cn("flex items-end gap-2", {
                  "justify-end": message.role === "user",
                  "justify-start": message.role === "assistant"
                })}>
                  {message.role === 'assistant' && (
                    <Avatar className="h-8 w-8">
                      <AvatarFallback>GA</AvatarFallback>
                    </Avatar>
                  )}
                  <p className={cn("max-w-[75%] rounded-lg px-3 py-2 text-sm", {
                    "bg-primary text-primary-foreground": message.role === "user",
                    "bg-muted": message.role === "assistant"
                  })}>
                    {message.text}
                  </p>
                </div>
              ))}
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
            />
            <Button type="submit" size="icon">
              <Send className="h-4 w-4" />
              <span className="sr-only">Send</span>
            </Button>
          </form>
        </CardFooter>
      </Card>
    </>
  );
}
