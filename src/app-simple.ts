import express from "express";
import cors from "cors";

export const app = express();

// Базовый CORS для всех доменов (временно для диагностики)
app.use(cors({
    origin: "*",
    credentials: false
}));

app.use(express.json());

// Простейшие эндпоинты без зависимостей
app.get("/health", (_, res) => {
    res.json({ ok: true, timestamp: new Date().toISOString() });
});

app.get("/debug", (_, res) => {
    res.json({
        status: 'ok',
        environment: {
            NODE_ENV: process.env.NODE_ENV || 'development',
            hasSmtpUser: !!process.env.SMTP_USER,
            hasSmtpPass: !!process.env.SMTP_PASS,
            hasSmtpHost: !!process.env.SMTP_HOST,
            clientOrigin: process.env.CLIENT_ORIGIN || 'not set'
        }
    });
});

// Простой test эндпоинт без SMTP
app.post("/test", (req, res) => {
    res.json({
        received: req.body,
        message: "Test endpoint working"
    });
});

// Только если есть все SMTP переменные, добавляем send-email
if (process.env.SMTP_USER && process.env.SMTP_PASS) {
    app.post("/send-email", async (req, res) => {
        try {
            // Здесь была бы логика отправки email
            res.json({ ok: true, message: "Email sending is available" });
        } catch (error) {
            res.status(500).json({
                ok: false,
                error: error instanceof Error ? error.message : 'Unknown error'
            });
        }
    });
} else {
    app.post("/send-email", (req, res) => {
        res.status(503).json({
            ok: false,
            error: "Email service not configured. Missing SMTP credentials."
        });
    });
}