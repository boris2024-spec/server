import rateLimit from "express-rate-limit";

export const sendEmailLimiter = rateLimit({
    windowMs: 60 * 1000, // 1 минута
    max: 5,              // не более 5 писем/минуту с одного IP
    standardHeaders: true,
    legacyHeaders: false,
});
