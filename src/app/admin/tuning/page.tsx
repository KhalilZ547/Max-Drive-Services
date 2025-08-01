
"use client";

import { useState, useCallback, useEffect } from "react";
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
import { Button } from "@/components/ui/button";
import { MoreHorizontal, Download, DollarSign, CheckCircle2 } from "lucide-react";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { useToast } from "@/hooks/use-toast";
import { AdminTuningSkeleton } from "@/components/AdminTuningSkeleton";
import type { TuningRequest } from "@/lib/mock-data";
import { Badge } from "@/components/ui/badge";
import { getTuningRequests, updateTuningRequestStatus } from "./actions";

export default function TuningRequestsPage() {
    const { toast } = useToast();
    const [requests, setRequests] = useState<TuningRequest[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    const fetchRequests = useCallback(async () => {
        setIsLoading(true);
        try {
            const fetchedRequests = await getTuningRequests();
            setRequests(fetchedRequests);
        } catch (error) {
            console.error("Failed to fetch tuning requests:", error);
            toast({ title: "Error", description: "Could not fetch requests.", variant: "destructive" });
        } finally {
            setIsLoading(false);
        }
    }, [toast]);


    useEffect(() => {
        fetchRequests();
    }, [fetchRequests]);

    const handleSetPrice = useCallback(async (request: TuningRequest) => {
        const price = prompt(`Set price for ${request.vehicle} - ${request.service}:`, "150");
        if (price && !isNaN(parseFloat(price))) {
            const result = await updateTuningRequestStatus(request.id, "Awaiting Payment", parseFloat(price));
            if (result.success) {
                toast({ title: "Price Set", description: `A quote has been sent to ${request.email}.` });
                fetchRequests();
            } else {
                toast({ title: "Error", description: result.error, variant: "destructive" });
            }
        }
    }, [fetchRequests, toast]);

    const handleMarkAsDone = useCallback(async (request: TuningRequest) => {
       const result = await updateTuningRequestStatus(request.id, "Completed");
       if (result.success) {
            toast({ title: "Marked as Completed", description: `The client will be notified to download their file.` });
            fetchRequests();
       } else {
           toast({ title: "Error", description: result.error, variant: "destructive" });
       }
    }, [fetchRequests, toast]);

    if (isLoading) {
        return <AdminTuningSkeleton />;
    }

    return (
        <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8">
            <Card>
                <CardHeader>
                    <CardTitle>ECU Tuning Requests</CardTitle>
                    <CardDescription>Manage incoming requests for ECU modifications.</CardDescription>
                </CardHeader>
                <CardContent>
                    {requests.length > 0 ? (
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Date</TableHead>
                                    <TableHead>Client</TableHead>
                                    <TableHead>Vehicle / Service</TableHead>
                                    <TableHead>Status</TableHead>
                                    <TableHead>Price</TableHead>
                                    <TableHead className="text-right">Actions</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {requests.map((request) => (
                                    <TableRow key={request.id}>
                                        <TableCell>{new Date(request.date).toLocaleDateString()}</TableCell>
                                        <TableCell>
                                            <div className="font-medium">{request.name}</div>
                                            <div className="text-sm text-muted-foreground">{request.email}</div>
                                        </TableCell>
                                        <TableCell>
                                            <div className="font-medium">{request.vehicle}</div>
                                            <div className="text-sm text-muted-foreground">{request.service}</div>
                                        </TableCell>
                                        <TableCell>
                                            <Badge variant={
                                                request.status === "Completed" ? "default" : 
                                                request.status === "Pending" ? "destructive" : "secondary"
                                            }>
                                                {request.status}
                                            </Badge>
                                        </TableCell>
                                        <TableCell>
                                            {request.price ? `$${request.price.toFixed(2)}` : 'N/A'}
                                        </TableCell>
                                        <TableCell className="text-right">
                                            <DropdownMenu>
                                                <DropdownMenuTrigger asChild>
                                                    <Button aria-haspopup="true" size="icon" variant="ghost">
                                                        <MoreHorizontal className="h-4 w-4" />
                                                        <span className="sr-only">Toggle menu</span>
                                                    </Button>
                                                </DropdownMenuTrigger>
                                                <DropdownMenuContent align="end">
                                                    <DropdownMenuLabel>Actions</DropdownMenuLabel>
                                                    <DropdownMenuItem onSelect={() => window.open(request.original_file_url!, '_blank')} disabled={!request.original_file_url}>
                                                        <Download className="mr-2 h-4 w-4" />
                                                        Download Original File
                                                    </DropdownMenuItem>
                                                    <DropdownMenuItem onSelect={() => handleSetPrice(request)} disabled={request.status !== 'Pending'}>
                                                        <DollarSign className="mr-2 h-4 w-4" />
                                                        Set Price & Send Quote
                                                    </DropdownMenuItem>
                                                    <DropdownMenuItem onSelect={() => handleMarkAsDone(request)} disabled={request.status !== 'Awaiting Payment'}>
                                                        Mark as Completed
                                                    </DropdownMenuItem>
                                                </DropdownMenuContent>
                                            </DropdownMenu>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    ) : (
                        <div className="text-center py-16">
                            <CheckCircle2 className="mx-auto h-12 w-12 text-green-500" />
                            <h3 className="mt-4 text-lg font-semibold">Queue is Clear</h3>
                            <p className="mt-2 text-sm text-muted-foreground">There are no pending tuning requests.</p>
                        </div>
                    )}
                </CardContent>
            </Card>
        </main>
    );
}
