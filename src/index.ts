
// import { app } from "./app";

// const port = Number(process.env.PORT ?? 3001);
// app.listen(port, () => {
//     console.log("Email server listening on", port);
// });





import express from 'express';

// Initialize express
const app = express();

// Health check endpoint
app.get('/health', (req, res) => {
    res.status(200).json({ status: 'ok' });
});

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
