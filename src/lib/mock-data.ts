
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
        id: 1, 
        name: 'Jane Doe', 
        email: 'jane.doe@example.com',
        vehicle: 'VW Golf 7 GTI 2019 2.0 TSI',
        service: 'Performance Tuning',
        fileType: 'flash' as const,
        date: '2024-05-18T10:00:00Z', 
        status: 'Awaiting Payment' as const, 
        price: 250.00,
        original_file_url: '#',
        modifiedFileUrl: null,
        notes: 'Looking for a Stage 1 tune for better daily driving.'
    },
    { 
        id: 2, 
        name: 'Carlos Rey', 
        email: 'carlos.rey@example.com',
        vehicle: 'BMW 330d 2020 3.0L',
        service: 'EGR Off',
        fileType: 'full_backup' as const,
        date: '2024-05-20T14:30:00Z', 
        status: 'Pending' as const, 
        price: null,
        original_file_url: '#',
        modifiedFileUrl: null,
        notes: ''
    },
    { 
        id: 3, 
        name: 'Frederic Dubois', 
        email: 'frederic.dubois@example.com',
        vehicle: 'Audi A3 2018 2.0 TDI',
        service: 'DTC Off',
        fileType: 'flash' as const,
        date: '2024-05-21T11:00:00Z', 
        status: 'Completed' as const, 
        price: 150.00,
        original_file_url: '#',
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
        models: ["A1", "A3", "A4", "A5", "A6", "Q3", "Q5", "Q7"],
        years: {
            "A1": ["2018", "2019", "2020", "2021"],
            "A3": ["2017", "2018", "2019", "2020"],
            "A4": ["2019", "2020", "2021", "2022"],
            "A5": ["2019", "2020", "2021", "2022"],
            "A6": ["2019", "2020", "2021", "2022"],
            "Q3": ["2019", "2020", "2021", "2022"],
            "Q5": ["2020", "2021", "2022", "2023"],
            "Q7": ["2020", "2021", "2022", "2023"],
        },
        engines: {
            "A1": {
                "2018": ["1.0 TFSI", "1.4 TFSI"],
                "2019": ["1.0 TFSI", "1.5 TFSI"],
                "2020": ["1.0 TFSI", "1.5 TFSI"],
                "2021": ["1.0 TFSI", "1.5 TFSI"],
            },
            "A3": {
                "2017": ["1.4 TFSI", "2.0 TDI", "2.0 TFSI"],
                "2018": ["1.5 TFSI", "2.0 TDI", "2.0 TFSI"],
                "2019": ["1.5 TFSI", "2.0 TDI", "2.0 TFSI"],
                "2020": ["1.5 TFSI", "2.0 TDI", "2.0 TFSI"],
            },
            "A4": {
                "2019": ["2.0 TFSI", "2.0 TDI", "3.0 TDI"],
                "2020": ["2.0 TFSI", "2.0 TDI", "3.0 TDI"],
                "2021": ["2.0 TFSI", "2.0 TDI", "3.0 TDI"],
                "2022": ["2.0 TFSI", "2.0 TDI", "3.0 TDI"],
            },
             "A5": {
                "2019": ["2.0 TFSI", "2.0 TDI", "3.0 TDI"],
                "2020": ["2.0 TFSI", "2.0 TDI", "3.0 TDI"],
                "2021": ["2.0 TFSI", "2.0 TDI", "3.0 TDI"],
                "2022": ["2.0 TFSI", "2.0 TDI", "3.0 TDI"],
            },
            "A6": {
                "2019": ["2.0 TFSI", "3.0 TDI"],
                "2020": ["2.0 TFSI", "3.0 TDI"],
                "2021": ["2.0 TFSI", "3.0 TDI", "4.0 TFSI"],
                "2022": ["2.0 TFSI", "3.0 TDI", "4.0 TFSI"],
            },
            "Q3": {
                "2019": ["1.5 TFSI", "2.0 TDI"],
                "2020": ["1.5 TFSI", "2.0 TDI"],
                "2021": ["1.5 TFSI", "2.0 TDI"],
                "2022": ["1.5 TFSI", "2.0 TDI", "2.5 TFSI"],
            },
            "Q5": {
                "2020": ["2.0 TFSI", "2.0 TDI", "3.0 TDI"],
                "2021": ["2.0 TFSI", "2.0 TDI", "3.0 TDI"],
                "2022": ["2.0 TFSI", "2.0 TDI", "3.0 TDI"],
                "2023": ["2.0 TFSI", "2.0 TDI", "3.0 TDI"],
            },
            "Q7": {
                "2020": ["3.0 TDI", "3.0 TFSI"],
                "2021": ["3.0 TDI", "3.0 TFSI"],
                "2022": ["3.0 TDI", "3.0 TFSI"],
                "2023": ["3.0 TDI", "3.0 TFSI"],
            },
        },
    },
    "BMW": {
        models: ["1 Series", "3 Series", "5 Series", "X1", "X3", "X5"],
        years: {
            "1 Series": ["2018", "2019", "2020", "2021"],
            "3 Series": ["2019", "2020", "2021", "2022"],
            "5 Series": ["2020", "2021", "2022", "2023"],
            "X1": ["2019", "2020", "2021", "2022"],
            "X3": ["2020", "2021", "2022", "2023"],
            "X5": ["2021", "2022", "2023", "2024"],
        },
        engines: {
            "1 Series": {
                "2018": ["118i", "120d"],
                "2019": ["118i", "M135i"],
                "2020": ["118i", "120d", "M135i"],
                "2021": ["118i", "120d", "M135i"],
            },
            "3 Series": {
                "2019": ["320i", "320d", "330d"],
                "2020": ["320i", "320d", "330d", "M340i"],
                "2021": ["320i", "320d", "330d", "M340i"],
                "2022": ["320i", "320d", "330d", "M340i"],
            },
            "5 Series": {
                "2020": ["520d", "530i", "540i"],
                "2021": ["520d", "530i", "540i"],
                "2022": ["520d", "530i", "540i"],
                "2023": ["520d", "530i", "540i"],
            },
            "X1": {
                "2019": ["sDrive18i", "xDrive20d"],
                "2020": ["sDrive18i", "xDrive20d"],
                "2021": ["sDrive18i", "xDrive20d"],
                "2022": ["sDrive18i", "xDrive20d"],
            },
            "X3": {
                "2020": ["xDrive20i", "xDrive30d"],
                "2021": ["xDrive20i", "xDrive30d", "M40i"],
                "2022": ["xDrive20i", "xDrive30d", "M40i"],
                "2023": ["xDrive20i", "xDrive30d", "M40i"],
            },
            "X5": {
                "2021": ["xDrive40i", "xDrive30d"],
                "2022": ["xDrive40i", "xDrive30d", "M50i"],
                "2023": ["xDrive40i", "xDrive30d", "M50i"],
                "2024": ["xDrive40i", "xDrive30d", "M60i"],
            }
        },
    },
    "Ford": {
        models: ["Fiesta", "Focus", "Mustang", "Ranger"],
        years: {
            "Fiesta": ["2018", "2019", "2020"],
            "Focus": ["2019", "2020", "2021"],
            "Mustang": ["2020", "2021", "2022"],
            "Ranger": ["2021", "2022", "2023"],
        },
        engines: {
            "Fiesta": {
                "2018": ["1.0 EcoBoost", "1.5 TDCi"],
                "2019": ["1.0 EcoBoost", "1.5 TDCi"],
                "2020": ["1.0 EcoBoost (mHEV)"],
            },
            "Focus": {
                "2019": ["1.0 EcoBoost", "1.5 EcoBlue"],
                "2020": ["1.0 EcoBoost", "1.5 EcoBlue"],
                "2021": ["1.0 EcoBoost (mHEV)", "1.5 EcoBlue"],
            },
            "Mustang": {
                "2020": ["2.3 EcoBoost", "5.0 V8"],
                "2021": ["2.3 EcoBoost", "5.0 V8"],
                "2022": ["2.3 EcoBoost", "5.0 V8"],
            },
            "Ranger": {
                "2021": ["2.0 EcoBlue", "3.2 TDCi"],
                "2022": ["2.0 EcoBlue", "3.0 V6 EcoBoost (Raptor)"],
                "2023": ["2.0 EcoBlue", "3.0 V6 EcoBoost (Raptor)"],
            },
        },
    },
    "Mercedes-Benz": {
        models: ["A-Class", "C-Class", "E-Class", "GLC"],
        years: {
            "A-Class": ["2018", "2019", "2020", "2021"],
            "C-Class": ["2019", "2020", "2021", "2022"],
            "E-Class": ["2020", "2021", "2022", "2023"],
            "GLC": ["2020", "2021", "2022", "2023"],
        },
        engines: {
            "A-Class": {
                "2018": ["A180d", "A200"],
                "2019": ["A180d", "A200", "A35 AMG"],
                "2020": ["A180d", "A200", "A35 AMG"],
                "2021": ["A180d", "A200", "A35 AMG"],
            },
            "C-Class": {
                "2019": ["C200", "C220d"],
                "2020": ["C200", "C220d", "C43 AMG"],
                "2021": ["C200", "C220d", "C43 AMG"],
                "2022": ["C200", "C300d", "C43 AMG"],
            },
            "E-Class": {
                "2020": ["E220d", "E350"],
                "2021": ["E220d", "E350", "E53 AMG"],
                "2022": ["E220d", "E350", "E53 AMG"],
                "2023": ["E220d", "E350", "E53 AMG"],
            },
            "GLC": {
                "2020": ["GLC 220d", "GLC 300"],
                "2021": ["GLC 220d", "GLC 300"],
                "2022": ["GLC 220d", "GLC 300"],
                "2023": ["GLC 220d", "GLC 300"],
            }
        },
    },
     "Peugeot": {
        models: ["208", "308", "2008", "3008"],
        years: {
            "208": ["2019", "2020", "2021"],
            "308": ["2018", "2019", "2020"],
            "2008": ["2020", "2021", "2022"],
            "3008": ["2021", "2022", "2023"],
        },
        engines: {
            "208": {
                "2019": ["1.2 PureTech", "1.5 BlueHDi"],
                "2020": ["1.2 PureTech", "1.5 BlueHDi"],
                "2021": ["1.2 PureTech", "1.5 BlueHDi"],
            },
            "308": {
                "2018": ["1.2 PureTech", "1.6 BlueHDi"],
                "2019": ["1.2 PureTech", "1.5 BlueHDi"],
                "2020": ["1.2 PureTech", "1.5 BlueHDi"],
            },
            "2008": {
                "2020": ["1.2 PureTech", "1.5 BlueHDi"],
                "2021": ["1.2 PureTech", "1.5 BlueHDi"],
                "2022": ["1.2 PureTech", "1.5 BlueHDi"],
            },
            "3008": {
                "2021": ["1.2 PureTech", "1.5 BlueHDi", "Hybrid 225"],
                "2022": ["1.2 PureTech", "1.5 BlueHDi", "Hybrid 225"],
                "2023": ["1.2 PureTech", "1.5 BlueHDi", "Hybrid 225"],
            },
        },
    },
    "Renault": {
        models: ["Clio", "Megane", "Captur", "Kadjar"],
        years: {
            "Clio": ["2019", "2020", "2021"],
            "Megane": ["2018", "2019", "2020"],
            "Captur": ["2020", "2021", "2022"],
            "Kadjar": ["2019", "2020", "2021"],
        },
        engines: {
            "Clio": {
                "2019": ["1.0 TCe", "1.5 Blue dCi"],
                "2020": ["1.0 TCe", "1.5 Blue dCi", "E-Tech Hybrid"],
                "2021": ["1.0 TCe", "1.5 Blue dCi", "E-Tech Hybrid"],
            },
            "Megane": {
                "2018": ["1.3 TCe", "1.5 dCi"],
                "2019": ["1.3 TCe", "1.5 Blue dCi"],
                "2020": ["1.3 TCe", "1.5 Blue dCi"],
            },
            "Captur": {
                "2020": ["1.0 TCe", "1.5 Blue dCi"],
                "2021": ["1.0 TCe", "1.3 TCe", "E-Tech Hybrid"],
                "2022": ["1.0 TCe", "1.3 TCe", "E-Tech Hybrid"],
            },
            "Kadjar": {
                "2019": ["1.3 TCe", "1.5 Blue dCi"],
                "2020": ["1.3 TCe", "1.5 Blue dCi"],
                "2021": ["1.3 TCe", "1.5 Blue dCi"],
            },
        },
    },
    "Volkswagen": {
        models: ["Polo", "Golf", "Passat", "Tiguan", "Touareg"],
        years: {
            "Polo": ["2018", "2019", "2020", "2021"],
            "Golf": ["2018", "2019", "2020", "2021"],
            "Passat": ["2019", "2020", "2021", "2022"],
            "Tiguan": ["2020", "2021", "2022", "2023"],
            "Touareg": ["2019", "2020", "2021", "2022"],
        },
        engines: {
             "Polo": {
                "2018": ["1.0 TSI", "1.6 TDI"],
                "2019": ["1.0 TSI", "1.6 TDI"],
                "2020": ["1.0 TSI", "1.6 TDI"],
                "2021": ["1.0 TSI"],
            },
            "Golf": {
                "2018": ["1.5 TSI", "2.0 TDI", "2.0 TSI (GTI)"],
                "2019": ["1.5 TSI", "2.0 TDI", "2.0 TSI (GTI)"],
                "2020": ["1.5 eTSI", "2.0 TDI"],
                "2021": ["1.5 eTSI", "2.0 TDI", "2.0 TSI (GTI)"],
            },
            "Passat": {
                 "2019": ["1.5 TSI", "2.0 TDI"],
                 "2020": ["1.5 TSI", "2.0 TDI"],
                 "2021": ["1.5 TSI", "2.0 TDI"],
                 "2022": ["1.5 TSI", "2.0 TDI"],
            },
            "Tiguan": {
                "2020": ["1.5 TSI", "2.0 TDI"],
                "2021": ["1.5 TSI", "2.0 TDI"],
                "2022": ["1.5 TSI", "2.0 TDI", "2.0 TSI (R)"],
                "2023": ["1.5 TSI", "2.0 TDI", "2.0 TSI (R)"],
            },
            "Touareg": {
                "2019": ["3.0 V6 TDI"],
                "2020": ["3.0 V6 TDI"],
                "2021": ["3.0 V6 TDI", "3.0 V6 TSI"],
                "2022": ["3.0 V6 TDI", "3.0 V6 TSI"],
            }
        },
    },
    "Other": {
        models: [],
        years: {},
        engines: {},
    }
};
