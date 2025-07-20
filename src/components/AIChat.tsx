
'use client';

import { useState, useCallback, useRef, useEffect } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { MessageSquare, Bot, User, CornerDownLeft, Loader2, CalendarCheck } from 'lucide-react';
import { useTranslation } from '@/hooks/use-translation';
import { invokeGarageAssistant } from '@/ai/flows/garage-assistant';
import { MessageData, Part } from 'genkit';

type ToolResponse = {
  name: 'bookAppointment';
  output: {
    serviceId: string;
    serviceName: string;
  };
};

type Message = {
  type: 'text';
  sender: 'user' | 'bot';
  text: string;
} | {
  type: 'tool';
  sender: 'bot';
  response: ToolResponse;
};


export function AIChat() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isPending, setIsPending] = useState(false);
  const { t } = useTranslation();
  const scrollAreaRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollAreaRef.current) {
      scrollAreaRef.current.scrollTo({ top: scrollAreaRef.current.scrollHeight, behavior: 'smooth' });
    }
  }, [messages]);

  const handleSend = useCallback(async () => {
    if (!input.trim() || isPending) return;

    const userMessage: Message = { type: 'text', sender: 'user', text: input };
    setMessages((prev) => [...prev, userMessage]);
    setInput('');
    setIsPending(true);

    const history: MessageData[] = messages.map(m => {
        if (m.type === 'text') {
            return {
                role: m.sender === 'bot' ? 'model' : 'user',
                content: [{ text: m.text }]
            };
        }
        return {
            role: 'model',
            content: [{ text: `Tool call: ${m.response.name}`}]
        }
    }).filter(Boolean) as MessageData[];

    try {
      const responsePart = await invokeGarageAssistant(null, { message: input, history });

      if (responsePart) {
        if (responsePart.text) {
          const botMessage: Message = { type: 'text', sender: 'bot', text: responsePart.text };
          setMessages((prev) => [...prev, botMessage]);
        } else if (responsePart.toolRequest) {
          const toolResponse: Message = {
            type: 'tool',
            sender: 'bot',
            response: {
              name: responsePart.toolRequest.name as ToolResponse['name'],
              output: responsePart.toolRequest.input as ToolResponse['output'],
            }
          };
          setMessages((prev) => [...prev, toolResponse]);
        }
      }
    } catch (error) {
      console.error("Failed to invoke assistant:", error);
      const errorMessage: Message = { type: 'text', sender: 'bot', text: "Sorry, I'm having a little trouble right now. Please try again later." };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsPending(false);
    }
  }, [input, messages, isPending]);

  const handleOpenChange = useCallback((open: boolean) => {
    setIsOpen(open);
    if(open && messages.length === 0){
        setMessages([{ type: 'text', sender: 'bot', text: t('ai_chat_welcome') }]);
    }
  }, [messages.length, t]);

  return (
    <>
      <Button
        className="fixed bottom-6 right-6 h-16 w-16 rounded-full shadow-lg"
        onClick={() => handleOpenChange(true)}
      >
        <MessageSquare className="h-8 w-8" />
      </Button>

      <Dialog open={isOpen} onOpenChange={handleOpenChange}>
        <DialogContent className="sm:max-w-[425px] md:max-w-[600px] flex flex-col h-[70vh]">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Bot />
              {t('ai_chat_title')}
            </DialogTitle>
          </DialogHeader>
          <ScrollArea className="flex-1 -mx-6 px-6" viewportRef={scrollAreaRef}>
            <div className="space-y-4 py-4">
              {messages.map((message, index) => (
                <div
                  key={index}
                  className={`flex items-start gap-3 ${
                    message.sender === 'user' ? 'justify-end' : ''
                  }`}
                >
                  {message.sender === 'bot' && (
                    <AvatarIcon>
                      <Bot className="h-6 w-6 text-primary" />
                    </AvatarIcon>
                  )}
                  
                  <div
                    className={`rounded-lg px-4 py-2 max-w-[80%] ${
                      message.type === 'text' && message.sender === 'user'
                        ? 'bg-primary text-primary-foreground'
                        : 'bg-muted'
                    }`}
                  >
                    {message.type === 'text' ? (
                        <p className="text-sm">{message.text}</p>
                    ) : (
                        <div className="space-y-3">
                            <p className="text-sm font-medium">I can help book that for you.</p>
                             <Button asChild onClick={() => setIsOpen(false)}>
                                <Link href={`/dashboard/appointment?service=${message.response.output.serviceId}`}>
                                    <CalendarCheck className="mr-2 h-4 w-4" />
                                    Book {message.response.output.serviceName}
                                </Link>
                            </Button>
                        </div>
                    )}
                  </div>

                   {message.sender === 'user' && (
                    <AvatarIcon>
                      <User className="h-6 w-6" />
                    </AvatarIcon>
                  )}
                </div>
              ))}
              {isPending && (
                 <div className="flex items-start gap-3">
                    <AvatarIcon><Bot className="h-6 w-6 text-primary" /></AvatarIcon>
                    <div className="rounded-lg px-4 py-2 bg-muted flex items-center">
                        <Loader2 className="h-5 w-5 animate-spin text-primary" />
                    </div>
                 </div>
              )}
            </div>
          </ScrollArea>
          <DialogFooter>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSend();
              }}
              className="flex w-full items-center space-x-2"
            >
              <Input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder={t('ai_chat_placeholder')}
                className="flex-1"
                disabled={isPending}
                onKeyDown={(e) => {
                    if(e.key === 'Enter' && !e.shiftKey) {
                        e.preventDefault();
                        handleSend();
                    }
                }}
              />
              <Button type="submit" size="icon" disabled={isPending || !input.trim()}>
                <CornerDownLeft className="h-4 w-4" />
              </Button>
            </form>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}

function AvatarIcon({ children }: { children: React.ReactNode }) {
    return <div className="flex h-10 w-10 shrink-0 overflow-hidden rounded-full items-center justify-center bg-card border">{children}</div>
}
