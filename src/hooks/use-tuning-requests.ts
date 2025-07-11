
'use client';

import { useState, useEffect, useCallback } from 'react';
import { tuningRequestsData, type TuningRequest } from '@/lib/mock-data';

const STORAGE_KEY = 'tuningRequests';

const getStoredRequests = (): TuningRequest[] => {
  if (typeof window === 'undefined') {
    return tuningRequestsData;
  }
  try {
    const item = window.localStorage.getItem(STORAGE_KEY);
    if (item) {
      return JSON.parse(item);
    }
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(tuningRequestsData));
    return tuningRequestsData;
  } catch (error) {
    console.error('Error reading from localStorage', error);
    return tuningRequestsData;
  }
};

const setStoredRequests = (requests: TuningRequest[]) => {
  if (typeof window !== 'undefined') {
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(requests));
      window.dispatchEvent(new Event('storage'));
    } catch (error) {
      console.error('Error writing to localStorage', error);
    }
  }
};

type NewRequestPayload = {
    name: string;
    email: string;
    vehicle: string;
    service: string;
    notes?: string;
}

export const useTuningRequests = () => {
  const [requests, setRequests] = useState<TuningRequest[]>(getStoredRequests());

  useEffect(() => {
    const handleStorageChange = () => {
      setRequests(getStoredRequests());
    };

    window.addEventListener('storage', handleStorageChange);
    return () => {
      window.removeEventListener('storage', handleStorageChange);
    };
  }, []);

  const updateAllRequests = useCallback((newRequests: TuningRequest[]) => {
    setStoredRequests(newRequests);
    setRequests(newRequests);
  }, []);

  const addRequest = useCallback((payload: NewRequestPayload) => {
    const newRequest: TuningRequest = {
        ...payload,
        id: `req_${new Date().getTime()}`,
        date: new Date().toISOString(),
        status: 'Pending',
        price: null,
        originalFileUrl: '#', // In a real app, this would be a URL to cloud storage
        modifiedFileUrl: null,
    };
    const newRequests = [newRequest, ...requests];
    updateAllRequests(newRequests);
  }, [requests, updateAllRequests]);

  const updateRequestStatus = useCallback((requestId: string, status: TuningRequest['status'], price?: number) => {
    const newRequests = requests.map(req => {
        if (req.id === requestId) {
            const updatedReq = { ...req, status };
            if (price !== undefined) {
                updatedReq.price = price;
            }
            return updatedReq;
        }
        return req;
    });
    updateAllRequests(newRequests);
  }, [requests, updateAllRequests]);


  return { requests, addRequest, updateRequestStatus };
};
