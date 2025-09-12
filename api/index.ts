import serverless from "serverless-http";
import { app } from "../src/app.js";

// Configure for Node.js runtime (required for nodemailer)
export const config = { runtime: "nodejs20.x" };

// Wrap Express app for Vercel serverless functions
const handler = serverless(app, {
    binary: false // For JSON responses
});

export default async function (req: any, res: any) {
    try {
        return await handler(req, res);
    } catch (e: any) {
        console.error("Serverless handler error:", e);
        res.status(500).json({ 
            ok: false, 
            error: e?.message ?? "Serverless function crashed" 
        });
    }
}