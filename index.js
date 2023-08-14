import express, { json, urlencoded } from "express";

import { mancer_generate } from "./driverroutes.js";
import { corsMiddleware } from "./middlewares.js";

import { DEBUG, SERVER_PORT, MANCERURL } from "./config.js";
import { tunnel } from "cloudflared";


process.on("uncaughtException", function (err) {
  if (DEBUG) console.error(`Caught exception: ${err}`);
});


let app = express();

// Middlewares
app.use(corsMiddleware);
app.use(json());
app.use(urlencoded({ extended: true }));
let modeldump = 'default'
if (MANCERURL !== "paste your mancer url here") {
  modeldump = MANCERURL.split('/')[4]
}
let model = 'default'

if(modeldump === 'weaver-alpha') model = 'Experimental Model'
else if (modeldump === 'mythomax') model = 'MythoMax'
else if (modeldump === 'oa-orca') model = 'OpenAssistant ORCA'
else if (modeldump === 'wizvic') model = 'Wizard Vicuna SuperHOT'

console.log(`Model: ${model}`)
// Register routes
app.all("/", async function (req, res) {
  res.set("Content-Type", "application/json");



  return res.status(200).json({
    status: true,
    model: model,
    github: "https://github.com/4e4f4148/JanitorAI-POE-Proxy",
    discord:
      "https://discord.com/channels/563783473115168788/1129375417673977867",
  });
});
let baselink = 'http://localhost:3000'

app.get("/api/v1/model", (req, res) => {
  res.send({"result": model})
});

const { url, connections, child, stop } = tunnel({
  "--url": `localhost:${SERVER_PORT}`,
});
baselink = await url;

app.post("/api/v1/generate", mancer_generate);




console.log(`\nProxy is running on PORT ${SERVER_PORT} ...`);
console.log(`\nLocal url:  http://localhost:${SERVER_PORT}`);

console.log(`Proxy url: ${baselink}`)
// Start server
app.listen(SERVER_PORT, () => {
  //   console.log(`Proxy is running on PORT ${SERVER_PORT} ...`);
});
