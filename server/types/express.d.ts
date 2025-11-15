declare global { 
    namespace Express  { 
        interface Request { 
            user?: {
                userId: string;
                email: string;
                applicationId: string;
                isVerified: boolean;
            }
            application?: {
                id: string;
                name: string;
                apiKey: string;
                secretKey: string;
                userId: string;
                requireEmailVerification: boolean;
                createdAt: Date;
                updatedAt: Date;
            }
        }
    }
}
export {}