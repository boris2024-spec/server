import "dotenv/config";
import express from "express";
import cors from "cors";
import helmet from "helmet";
import { emailSchema } from "./validators.js";
import { sendEmail } from "./mailer.js";
import { sendEmailLimiter } from "./rateLimit.js";

export const app = express();

// Middleware
app.use(helmet());
app.use(express.json({ limit: "200kb" }));
app.use(cors({
    origin: process.env.CLIENT_ORIGIN?.split(",") ?? "*",
    credentials: false
}));

// Error handling middleware
app.use((err: any, _req: any, res: any, _next: any) => {
    console.error("Express error:", err);
    res.status(500).json({ ok: false, error: err?.message ?? "Internal error" });
});

// Routes
app.get("/health", (_, res) => res.json({ ok: true }));

app.post("/send-email", sendEmailLimiter, async (req, res) => {
    const parsed = emailSchema.safeParse(req.body);
    if (!parsed.success) {
        return res.status(400).json({ error: parsed.error.flatten() });
    }
    try {
        await sendEmail(parsed.data);
        res.json({ ok: true });
    } catch (e: any) {
        console.error("Send email error:", e);
        res.status(500).json({ ok: false, error: e?.message ?? "Send failed" });
    }
});