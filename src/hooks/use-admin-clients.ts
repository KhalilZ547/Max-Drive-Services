
'use client';

import { useState, useEffect, useCallback } from 'react';
import { clientsData, type Client } from '@/lib/mock-data';

const STORAGE_KEY = 'adminClients';

// Helper function to get clients from localStorage
const getStoredClients = (): Client[] => {
  if (typeof window === 'undefined') {
    return clientsData;
  }
  try {
    const item = window.localStorage.getItem(STORAGE_KEY);
    if (item) {
      return JSON.parse(item);
    }
    // If no data in localStorage, initialize with mock data
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(clientsData));
    return clientsData;
  } catch (error) {
    console.error('Error reading from localStorage', error);
    return clientsData;
  }
};

// Helper function to set clients in localStorage
const setStoredClients = (clients: Client[]) => {
  if (typeof window !== 'undefined') {
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(clients));
      // Dispatch a storage event to notify other tabs/windows
      window.dispatchEvent(new Event('storage'));
    } catch (error) {
      console.error('Error writing to localStorage', error);
    }
  }
};

export const useAdminClients = () => {
  const [clients, setClients] = useState<Client[]>(getStoredClients());

  // Listen for storage changes to sync across tabs
  useEffect(() => {
    const handleStorageChange = () => {
      setClients(getStoredClients());
    };

    window.addEventListener('storage', handleStorageChange);
    return () => {
      window.removeEventListener('storage', handleStorageChange);
    };
  }, []);

  const updateClients = useCallback((newClients: Client[]) => {
    setStoredClients(newClients);
    setClients(newClients);
  }, []);

  const addClient = useCallback((newClientData: Omit<Client, 'id' | 'registered'>) => {
    const newClient: Client = {
      ...newClientData,
      id: `usr_${new Date().getTime()}`,
      registered: new Date().toISOString().split('T')[0],
    };
    const newClients = [...clients, newClient];
    updateClients(newClients);
  }, [clients, updateClients]);

  const deleteClient = useCallback((clientId: string) => {
    const newClients = clients.filter((c) => c.id !== clientId);
    updateClients(newClients);
  }, [clients, updateClients]);

  const updateClient = useCallback((updatedClient: Client) => {
    const newClients = clients.map((c) =>
      c.id === updatedClient.id ? updatedClient : c
    );
    updateClients(newClients);
  }, [clients, updateClients]);


  return { clients, addClient, deleteClient, updateClient };
};
