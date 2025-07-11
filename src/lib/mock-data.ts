
// Mock data for clients
export const clientsData = [
    { id: 'usr_1', name: 'Ahmed Ben Ali', email: 'ahmed.benali@example.com', registered: '2023-05-12' },
    { id: 'usr_2', name: 'Fatima Dubois', email: 'fatima.dubois@example.com', registered: '2023-06-20' },
    { id: 'usr_3', name: 'John Smith', email: 'john.smith@example.com', registered: '2023-07-01' },
    { id: 'usr_4', name: 'Karim Ben Ahmed', email: 'karim@example.com', registered: '2024-01-15' },
    { id: 'usr_5', name: 'Aisha Muller', email: 'aisha.muller@example.com', registered: '2024-03-22' },
];

export type Client = (typeof clientsData)[0];

export const tuningRequestsData = [
    { 
        id: 'req_1', 
        name: 'Jane Doe', 
        email: 'jane.doe@example.com',
        vehicle: 'VW Golf 7 GTI 2019',
        service: 'Performance Tuning',
        date: '2024-05-18T10:00:00Z', 
        status: 'Awaiting Payment' as const, 
        price: 250.00,
        originalFileUrl: '#',
        modifiedFileUrl: null,
        notes: 'Looking for a Stage 1 tune for better daily driving.'
    },
    { 
        id: 'req_2', 
        name: 'Carlos Rey', 
        email: 'carlos.rey@example.com',
        vehicle: 'BMW 330d 2020',
        service: 'EGR Off',
        date: '2024-05-20T14:30:00Z', 
        status: 'Pending' as const, 
        price: null,
        originalFileUrl: '#',
        modifiedFileUrl: null,
        notes: ''
    },
];

export type TuningRequest = (typeof tuningRequestsData)[0];
