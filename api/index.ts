import serverless from "serverless-http";
import { app } from "../src/app.js";

// Wrap Express app for Vercel serverless functions
const handler = serverless(app);

export default handler;