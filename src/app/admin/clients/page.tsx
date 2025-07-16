
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
import { AdminClientsSkeleton } from "@/components/AdminClientsSkeleton";
import type { Client } from "@/lib/mock-data";
import { getClients, addClient, updateClient, deleteClient } from "./actions";


export default function ClientsPage() {
    const { toast } = useToast();
    const [clients, setClients] = useState<Client[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    
    const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
    const [editingClient, setEditingClient] = useState<Client | null>(null);
    const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
    const [deletingClientId, setDeletingClientId] = useState<string | null>(null);

    const fetchClients = useCallback(async () => {
        setIsLoading(true);
        try {
            const fetchedClients = await getClients();
            setClients(fetchedClients);
        } catch (error) {
            console.error("Failed to fetch clients for page:", error);
            toast({ title: "Error", description: "Could not fetch clients. Please try again later.", variant: "destructive" });
        } finally {
            setIsLoading(false);
        }
    }, [toast]);

    useEffect(() => {
        fetchClients();
    }, [fetchClients]);

    const handleEdit = useCallback((client: Client) => {
        setEditingClient(client);
        setIsEditDialogOpen(true);
    }, []);

    const handleDelete = useCallback((clientId: string) => {
        setDeletingClientId(clientId);
    }, []);

    const confirmDelete = useCallback(async () => {
        if (!deletingClientId) return;
        
        try {
            await deleteClient(deletingClientId);
            toast({ title: "Client Deleted", description: "The client has been successfully removed." });
            setDeletingClientId(null);
            fetchClients(); // Refresh the list
        } catch (error) {
            console.error("Failed to delete client:", error);
            toast({ title: "Error", description: "Could not delete client.", variant: "destructive" });
        }
    }, [deletingClientId, fetchClients, toast]);

    const handleUpdateClient = useCallback(async (updatedClient: Client) => {
        const result = await updateClient(updatedClient);
        if (result.success) {
            toast({ title: "Client Updated", description: "The client's information has been successfully updated."});
            setIsEditDialogOpen(false);
            setEditingClient(null);
            fetchClients();
        } else {
            toast({ title: "Update Failed", description: result.error, variant: "destructive" });
        }
    }, [toast, fetchClients]);
    
    const handleAddClient = useCallback(async (newClientData: Omit<Client, 'id' | 'registered'>) => {
        const result = await addClient(newClientData);
        if(result.success) {
            toast({ title: "Client Added", description: `An invitation email has been sent to ${newClientData.email}.`});
            setIsAddDialogOpen(false);
            fetchClients();
        } else {
             toast({ title: "Failed to Add Client", description: result.error, variant: "destructive" });
        }
    }, [fetchClients, toast]);

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
                        {clients.length > 0 && (
                            <Button onClick={() => setIsAddDialogOpen(true)}>Add New Client</Button>
                        )}
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
                    onOpenChange={(open) => {
                      if (!open) setEditingClient(null);
                      setIsEditDialogOpen(open);
                    }}
                    client={editingClient}
                    onUpdateClient={handleUpdateClient}
                />
            )}
            <AlertDialog open={!!deletingClientId} onOpenChange={(open) => {if(!open) setDeletingClientId(null)}}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                        <AlertDialogDescription>
                            This action cannot be undone. This will permanently delete the client's account from your records.
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
