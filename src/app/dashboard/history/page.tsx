
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

const serviceHistory = [
    { vehicle: 'Toyota Camry 2021', service: 'Oil Change', date: '2023-10-26', cost: 50.00 },
    { vehicle: 'Honda Civic 2019', service: 'Brake Repair', date: '2023-09-15', cost: 250.00 },
    { vehicle: 'Toyota Camry 2021', service: 'Engine Diagnostic', date: '2023-11-05', cost: 100.00 },
];

const TND_TO_EUR_RATE = 0.3; // Approximate conversion rate

export default function HistoryPage() {
    const { t } = useTranslation();
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const timer = setTimeout(() => setIsLoading(false), 1000);
        return () => clearTimeout(timer);
    }, []);

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
                        <p>{t('history_page_no_history')}</p>
                    )}
                </CardContent>
            </Card>
        </main>
    );
}
