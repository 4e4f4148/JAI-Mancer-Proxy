// Server configuration
import dotenv from "dotenv";
dotenv.config();

export const SERVER_PORT = process.env.PORT || 3000; // Server port
export const DEBUG = false; // Debug mode
export const PRIOD = 15 * 1000; // 15 seconds
export const RATE_LIMIT = 50; // 50 requests per 15 seconds
export const WHITELISTED_IPS = [
  // "127.0.0.1"
];
// Prompt Moderation before sending to OpenAI
export const MODERATION = false; // Moderation mode
export let MANCERKEY = process.env.MANCERKEY || "Your mancer key here";

export let MANCERMODEL = process.env.MANCERMODEL || "choose one between: weaver-alpha, oa-orca, wizvic";
