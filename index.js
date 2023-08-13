import express, { json, urlencoded } from "express";

import { mancer_generate } from "./driverroutes.js";
import { corsMiddleware, rateLimitMiddleware } from "./middlewares.js";

import { DEBUG, SERVER_PORT, MANCERMODEL } from "./config.js";
import { tunnel } from "cloudflared";


process.on("uncaughtException", function (err) {
  if (DEBUG) console.error(`Caught exception: ${err}`);
});


let app = express();

// Middlewares
app.use(corsMiddleware);
app.use(rateLimitMiddleware);
app.use(json());
app.use(urlencoded({ extended: true }));

// Register routes
app.all("/", async function (req, res) {
  res.set("Content-Type", "application/json");
  let model = ''
  if(MANCERMODEL === 'weaver-alpha') model = 'Experimental Model'
  else if (MANCERMODEL === 'oa-orca') model = 'OpenAssistant ORCA'
  else if (MANCERMODEL === 'wizvic') model = 'Wizard Vicuna SuperHOT'

  return res.status(200).json({
    status: true,
    model: model,
    github: "https://github.com/4e4f4148/JanitorAI-POE-Proxy",
    discord:
      "https://discord.com/channels/563783473115168788/1129375417673977867",
  });
});
let baselink = 'http://localhost:3000'

const { url, connections, child, stop } = tunnel({
  "--url": `localhost:${SERVER_PORT}`,
});
baselink = await url;

app.post("/api/v1/generate", mancer_generate);

console.log(`\nProxy is running on PORT ${SERVER_PORT} ...`);
console.log(`proxy url: ${baselink}`)
// Start server
app.listen(SERVER_PORT, () => {
  //   console.log(`Proxy is running on PORT ${SERVER_PORT} ...`);
});
