
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
import { Button, buttonVariants } from "@/components/ui/button";
import { MoreHorizontal, Users } from "lucide-react";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { useToast } from "@/hooks/use-toast";
import { EditClientDialog } from "@/components/EditClientDialog";
import { AddClientDialog } from "@/components/AddClientDialog";
import { useAdminClients } from "@/hooks/use-admin-clients";
import type { Client } from "@/lib/mock-data";
import { AdminClientsSkeleton } from "@/components/AdminClientsSkeleton";


export default function ClientsPage() {
    const { toast } = useToast();
    const { clients, addClient, updateClient, deleteClient } = useAdminClients();
    const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
    const [editingClient, setEditingClient] = useState<Client | null>(null);
    const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
    const [deletingClientId, setDeletingClientId] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const timer = setTimeout(() => setIsLoading(false), 1000);
        return () => clearTimeout(timer);
    }, []);

    const handleEdit = useCallback((client: Client) => {
        setEditingClient(client);
        setIsEditDialogOpen(true);
    }, []);

    const handleDelete = useCallback((clientId: string) => {
        setDeletingClientId(clientId);
    }, []);

    const confirmDelete = useCallback(() => {
        if (!deletingClientId) return;
        deleteClient(deletingClientId);
        toast({ title: "Client Deleted", description: "The client has been successfully removed.", variant: "destructive" });
        setDeletingClientId(null);
    }, [deletingClientId, deleteClient, toast]);

    const handleUpdateClient = useCallback((updatedClient: Client) => {
        updateClient(updatedClient);
        toast({ title: "Client Updated", description: "The client's information has been successfully updated."});
        setEditingClient(null);
    }, [toast, updateClient]);
    
    const handleAddClient = useCallback((newClientData: Omit<Client, 'id' | 'registered'>) => {
        addClient(newClientData);
        toast({ title: "Client Added", description: "The new client has been successfully added."});
        setIsAddDialogOpen(false);
    }, [addClient, toast]);

    if (isLoading) {
        return <AdminClientsSkeleton />;
    }

    return (
        <>
            <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8">
                <Card>
                    <CardHeader className="flex-row items-center justify-between">
                        <div>
                            <CardTitle>Clients</CardTitle>
                            <CardDescription>Manage your clients and view their details.</CardDescription>
                        </div>
                        <Button onClick={() => setIsAddDialogOpen(true)}>Add New Client</Button>
                    </CardHeader>
                    <CardContent>
                        {clients.length > 0 ? (
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>Name</TableHead>
                                        <TableHead>Email</TableHead>
                                        <TableHead>Registered On</TableHead>
                                        <TableHead>
                                            <span className="sr-only">Actions</span>
                                        </TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {clients.map((client) => (
                                        <TableRow key={client.id}>
                                            <TableCell className="font-medium">{client.name}</TableCell>
                                            <TableCell>{client.email}</TableCell>
                                            <TableCell>{client.registered}</TableCell>
                                            <TableCell>
                                                <DropdownMenu>
                                                    <DropdownMenuTrigger asChild>
                                                        <Button aria-haspopup="true" size="icon" variant="ghost">
                                                            <MoreHorizontal className="h-4 w-4" />
                                                            <span className="sr-only">Toggle menu</span>
                                                        </Button>
                                                    </DropdownMenuTrigger>
                                                    <DropdownMenuContent align="end">
                                                        <DropdownMenuLabel>Actions</DropdownMenuLabel>
                                                        <DropdownMenuItem onSelect={() => handleEdit(client)}>Edit</DropdownMenuItem>
                                                        <DropdownMenuItem onSelect={() => handleDelete(client.id)} className="text-destructive focus:text-destructive">Delete</DropdownMenuItem>
                                                    </DropdownMenuContent>
                                                </DropdownMenu>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        ) : (
                            <div className="text-center py-16">
                                <Users className="mx-auto h-12 w-12 text-muted-foreground" />
                                <h3 className="mt-4 text-lg font-semibold">No Clients Found</h3>
                                <p className="mt-2 text-sm text-muted-foreground">Get started by adding a new client.</p>
                                <Button className="mt-4" onClick={() => setIsAddDialogOpen(true)}>Add Client</Button>
                            </div>
                        )}
                    </CardContent>
                </Card>
            </main>
            <AddClientDialog
                isOpen={isAddDialogOpen}
                onOpenChange={setIsAddDialogOpen}
                onAddClient={handleAddClient}
            />
            {editingClient && (
                <EditClientDialog
                    isOpen={isEditDialogOpen}
                    onOpenChange={setIsEditDialogOpen}
                    client={editingClient}
                    onUpdateClient={handleUpdateClient}
                />
            )}
            <AlertDialog open={!!deletingClientId} onOpenChange={(open) => {if(!open) setDeletingClientId(null)}}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                        <AlertDialogDescription>
                            This action cannot be undone. This will permanently delete the client's account.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction
                            onClick={confirmDelete}
                            className={buttonVariants({ variant: "destructive" })}
                        >
                            Delete
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </>
    );
}
