import "dotenv/config";
import express from "express";
import cors from "cors";
import helmet from "helmet";
import { emailSchema } from "./validators.js";
import { sendEmail } from "./mailer.js";
import { sendEmailLimiter } from "./rateLimit.js";

const app = express();

app.use(helmet());
app.use(express.json({ limit: "200kb" }));
app.use(cors({
    origin: process.env.CLIENT_ORIGIN?.split(",") ?? "*"
}));

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
        res.status(500).json({ ok: false, error: e?.message ?? "Send failed" });
    }
});

const port = Number(process.env.PORT ?? 3001);
app.listen(port, () => {
    console.log("Email server listening on", port);
});
