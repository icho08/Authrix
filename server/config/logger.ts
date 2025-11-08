const timestamp = () => new Date().toISOString();

export const logger = { 
    info: (message: any) => console.log(`\x1b[36m[${timestamp()}] INFO:\x1b[0m`, message), 
    error: (message: any) => console.error(`\x1b[31m[${timestamp()}] ERROR:\x1b[0m`, message), 
    warn: (message: any) => console.warn(`\x1b[33m[${timestamp()}] WARN:\x1b[0m`, message), 
    debug: (message: any) => console.log(`\x1b[35m[${timestamp()}] DEBUG:\x1b[0m`, message),
    success: (message: any) => console.log(`\x1b[32m[${timestamp()}] SUCCESS:\x1b[0m`, message)
}