
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
        vehicle: 'VW Golf 7 GTI 2019 2.0 TSI',
        service: 'Performance Tuning',
        fileType: 'flash' as const,
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
        vehicle: 'BMW 330d 2020 3.0L',
        service: 'EGR Off',
        fileType: 'full_backup' as const,
        date: '2024-05-20T14:30:00Z', 
        status: 'Pending' as const, 
        price: null,
        originalFileUrl: '#',
        modifiedFileUrl: null,
        notes: ''
    },
    { 
        id: 'req_3', 
        name: 'Frederic Dubois', 
        email: 'frederic.dubois@example.com',
        vehicle: 'Audi A3 2018 2.0 TDI',
        service: 'DTC Off',
        fileType: 'flash' as const,
        date: '2024-05-21T11:00:00Z', 
        status: 'Completed' as const, 
        price: 150.00,
        originalFileUrl: '#',
        modifiedFileUrl: '#',
        notes: 'Please remove P0401.'
    },
];

export type TuningRequest = (typeof tuningRequestsData)[0];


export const vehicleData: Record<string, {
    models: string[];
    years: Record<string, string[]>;
    engines: Record<string, Record<string, string[]>>;
}> = {
    "Audi": {
        models: ["A3", "A4", "Q5"],
        years: {
            "A3": ["2018", "2019", "2020"],
            "A4": ["2020", "2021", "2022"],
            "Q5": ["2021", "2022", "2023"],
        },
        engines: {
            "A3": {
                "2018": ["1.4 TFSI", "2.0 TDI"],
                "2019": ["1.5 TFSI", "2.0 TDI"],
                "2020": ["1.5 TFSI", "2.0 TDI"],
            },
            "A4": {
                "2020": ["2.0 TFSI", "3.0 TDI"],
                "2021": ["2.0 TFSI", "3.0 TDI"],
                "2022": ["2.0 TFSI", "3.0 TDI"],
            },
            "Q5": {
                "2021": ["2.0 TFSI", "3.0 TDI"],
                "2022": ["2.0 TFSI", "3.0 TDI"],
                "2023": ["2.0 TFSI", "3.0 TDI"],
            },
        },
    },
    "BMW": {
        models: ["3 Series", "5 Series", "X5"],
        years: {
            "3 Series": ["2019", "2020", "2021"],
            "5 Series": ["2020", "2021", "2022"],
            "X5": ["2021", "2022", "2023"],
        },
        engines: {
            "3 Series": {
                "2019": ["320i", "330d"],
                "2020": ["320i", "330d", "M340i"],
                "2021": ["320i", "330d", "M340i"],
            },
            "5 Series": {
                "2020": ["520d", "540i"],
                "2021": ["520d", "540i"],
                "2022": ["520d", "540i"],
            },
            "X5": {
                "2021": ["xDrive40i", "xDrive30d"],
                "2022": ["xDrive40i", "xDrive30d"],
                "2023": ["xDrive40i", "xDrive30d"],
            }
        },
    },
    "Volkswagen": {
        models: ["Golf", "Passat", "Tiguan"],
        years: {
            "Golf": ["2018", "2019", "2020"],
            "Passat": ["2019", "2020", "2021"],
            "Tiguan": ["2020", "2021", "2022"],
        },
        engines: {
            "Golf": {
                "2018": ["1.5 TSI", "2.0 TDI", "2.0 TSI (GTI)"],
                "2019": ["1.5 TSI", "2.0 TDI", "2.0 TSI (GTI)"],
                "2020": ["1.5 eTSI", "2.0 TDI"],
            },
            "Passat": {
                 "2019": ["1.5 TSI", "2.0 TDI"],
                 "2020": ["1.5 TSI", "2.0 TDI"],
                 "2021": ["1.5 TSI", "2.0 TDI"],
            },
            "Tiguan": {
                "2020": ["1.5 TSI", "2.0 TDI"],
                "2021": ["1.5 TSI", "2.0 TDI"],
                "2022": ["1.5 TSI", "2.0 TDI"],
            }
        },
    },
};
