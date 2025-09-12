import express from "express";
import cors from "cors";
import nodemailer from "nodemailer";
import dotenv from "dotenv";
dotenv.config();

export const app = express();

// CORS настройки
const allowedOrigins = process.env.CLIENT_ORIGIN?.split(",") || [
    "http://localhost:3000",
    "http://localhost:3001",
    "https://mdimona-cahnqf9ph-boris-projects-342aa06a.vercel.app"
];

app.use(cors({
    origin: (origin, callback) => {
        // Разрешить запросы без origin (например, мобильные приложения)
        if (!origin) return callback(null, true);

        if (allowedOrigins.includes(origin)) {
            callback(null, true);
        } else {
            callback(new Error('Not allowed by CORS'));
        }
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"]
}));

app.use(express.json({ limit: "200kb" }));

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
            hasMailFrom: !!process.env.MAIL_FROM,
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

// Функция создания transporter
const createTransporter = () => {
    const {
        SMTP_HOST, SMTP_PORT, SMTP_SECURE,
        SMTP_USER, SMTP_PASS
    } = process.env;

    if (!SMTP_USER || !SMTP_PASS) {
        throw new Error("SMTP credentials missing");
    }

    return nodemailer.createTransport({
        host: SMTP_HOST,
        port: Number(SMTP_PORT || 465),
        secure: String(SMTP_SECURE || "true") === "true",
        connectionTimeout: 60000, // 60 секунд
        greetingTimeout: 30000,   // 30 секунд
        socketTimeout: 60000,     // 60 секунд
        auth: {
            user: SMTP_USER,
            pass: SMTP_PASS
        }
    });
};

// Email эндпоинт
app.post("/send-email", async (req, res) => {
    const timeoutId = setTimeout(() => {
        if (!res.headersSent) {
            res.status(408).json({
                ok: false,
                error: "Request timeout"
            });
        }
    }, 25000); // 25 секунд (меньше чем 30 сек лимит Vercel)

    try {
        const { to, subject, html, text } = req.body;

        if (!to || !subject || !html) {
            clearTimeout(timeoutId);
            return res.status(400).json({
                ok: false,
                error: "Missing required fields: to, subject, html"
            });
        }

        // Проверяем наличие SMTP переменных
        if (!process.env.SMTP_USER || !process.env.SMTP_PASS) {
            clearTimeout(timeoutId);
            console.log("SMTP not configured, simulating email send for:", { to, subject });
            // Симуляция отправки email для тестирования
            setTimeout(() => {
                if (!res.headersSent) {
                    res.json({
                        ok: true,
                        message: "Email simulated (SMTP not configured)",
                        data: { to, subject }
                    });
                }
                clearTimeout(timeoutId);
            }, 1000);
            return;
        }

        const transporter = createTransporter();
        const { MAIL_FROM, SMTP_USER } = process.env;

        await transporter.sendMail({
            from: MAIL_FROM || SMTP_USER,
            to,
            subject,
            html,
            text
        });

        clearTimeout(timeoutId);
        if (!res.headersSent) {
            res.json({ ok: true });
        }

    } catch (error) {
        clearTimeout(timeoutId);
        console.error("Send email error:", error);
        if (!res.headersSent) {
            res.status(500).json({
                ok: false,
                error: error instanceof Error ? error.message : 'Unknown error'
            });
        }
    }
});