// Server configuration
import dotenv from "dotenv";
dotenv.config();

export const SERVER_PORT = process.env.PORT || 3000; // Server port
export const DEBUG = false; // Debug mode

export let MANCERKEY = process.env.MANCERKEY || "Your mancer key here";

export let MANCERURL = process.env.MANCERURL || "paste your mancer url here";