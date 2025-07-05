
"use client";

import { useState } from "react";
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
import { MoreHorizontal } from "lucide-react";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { useToast } from "@/hooks/use-toast";
import { EditClientDialog } from "@/components/EditClientDialog";


// Mock data for clients
const clientsData = [
    { id: 'usr_1', name: 'Ahmed Ben Ali', email: 'ahmed.benali@example.com', registered: '2023-05-12' },
    { id: 'usr_2', name: 'Fatima Dubois', email: 'fatima.dubois@example.com', registered: '2023-06-20' },
    { id: 'usr_3', name: 'John Smith', email: 'john.smith@example.com', registered: '2023-07-01' },
    { id: 'usr_4', name: 'Karim Ben Ahmed', email: 'karim@example.com', registered: '2024-01-15' },
    { id: 'usr_5', name: 'Aisha Muller', email: 'aisha.muller@example.com', registered: '2024-03-22' },
];

type Client = typeof clientsData[0];

export default function ClientsPage() {
    const { toast } = useToast();
    const [clients, setClients] = useState(clientsData);
    const [editingClient, setEditingClient] = useState<Client | null>(null);
    const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);


    const handleEdit = (client: Client) => {
        setEditingClient(client);
        setIsEditDialogOpen(true);
    };

    const handleDelete = (clientId: string) => {
        // In a real app, this would show a confirmation dialog before deleting
        toast({ title: "Delete Client", description: `Triggered delete for client ID: ${clientId}`, variant: "destructive" });
    };

    const handleUpdateClient = (updatedClient: Client) => {
        setClients(clients.map(c => c.id === updatedClient.id ? updatedClient : c));
        toast({ title: "Client Updated", description: "The client's information has been successfully updated."});
        setEditingClient(null);
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
                        <Button>Add New Client</Button>
                    </CardHeader>
                    <CardContent>
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
                                                    <DropdownMenuItem onSelect={() => handleDelete(client.id)} className="text-destructive">Delete</DropdownMenuItem>
                                                </DropdownMenuContent>
                                            </DropdownMenu>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </CardContent>
                </Card>
            </main>
            {editingClient && (
                <EditClientDialog
                    isOpen={isEditDialogOpen}
                    onOpenChange={setIsEditDialogOpen}
                    client={editingClient}
                    onUpdateClient={handleUpdateClient}
                />
            )}
        </>
    );
}
