import { Inngest } from "inngest"; 

// Create a client to send and receive events
export const inngest = new Inngest({ 
    id: "Traco",
    name: "Traco App",
    retryFunctions: async (attempt) => ({
        delay : 1000 * Math.pow(2, attempt),
        maxAttempts: 2,
    })
 });