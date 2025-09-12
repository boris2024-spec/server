import { z } from "zod";

export const emailSchema = z.object({
    to: z.string().email(),
    subject: z.string().min(1).max(200),
    html: z.string().min(1),
    // опционально: plain text
    text: z.string().optional()
});

export type EmailInput = z.infer<typeof emailSchema>;
