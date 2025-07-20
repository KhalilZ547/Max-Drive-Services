
"use client";

import { useState, useEffect } from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useTranslation } from "@/hooks/use-translation";
import { HistoryPageSkeleton } from '@/components/HistoryPageSkeleton';
import { History } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { getServiceHistory, type ServiceHistoryItem } from './actions';
import { useToast } from '@/hooks/use-toast';

const TND_TO_EUR_RATE = 0.3; // Approximate conversion rate

export default function HistoryPage() {
    const { t } = useTranslation();
    const { toast } = useToast();
    const [isLoading, setIsLoading] = useState(true);
    const [serviceHistory, setServiceHistory] = useState<ServiceHistoryItem[]>([]);

    useEffect(() => {
        async function loadHistory() {
            try {
                const history = await getServiceHistory();
                setServiceHistory(history);
            } catch (error) {
                console.error("Failed to fetch service history:", error);
                toast({
                    title: "Error",
                    description: "Could not fetch your service history. Please try again later.",
                    variant: "destructive"
                });
            } finally {
                setIsLoading(false);
            }
        }
        loadHistory();
    }, [toast]);

    if (isLoading) {
        return <HistoryPageSkeleton />;
    }

    return (
        <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8">
            <Card>
                <CardHeader>
                    <CardTitle>{t('tab_history')}</CardTitle>
                    <CardDescription>{t('history_page_description')}</CardDescription>
                </CardHeader>
                <CardContent>
                    {serviceHistory.length > 0 ? (
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>{t('service_history_vehicle')}</TableHead>
                                    <TableHead>{t('service_history_service')}</TableHead>
                                    <TableHead>{t('service_history_date')}</TableHead>
                                    <TableHead>{t('service_history_cost')} (TND / EUR)</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {serviceHistory.map((item, index) => (
                                    <TableRow key={index}>
                                        <TableCell>{item.vehicle}</TableCell>
                                        <TableCell>{item.service}</TableCell>
                                        <TableCell>{item.date}</TableCell>
                                        <TableCell className="whitespace-nowrap">{item.cost.toFixed(2)} TND (€{(item.cost * TND_TO_EUR_RATE).toFixed(2)})</TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    ) : (
                        <div className="text-center py-16">
                            <History className="mx-auto h-12 w-12 text-muted-foreground" />
                            <h3 className="mt-4 text-lg font-semibold">{t('history_page_no_history')}</h3>
                            <p className="mt-2 text-sm text-muted-foreground">Your completed services will appear here.</p>
                            <Button className="mt-4" asChild>
                                <Link href="/dashboard/appointment">{t('book_appointment_cta')}</Link>
                            </Button>
                        </div>
                    )}
                </CardContent>
            </Card>
        </main>
    );
}
