/**
 * Example to subscribe to the data stream API.
 */
import WebSocket from "ws";
import { loadAllEntities } from "../utils.mjs";
import { loadDevices } from "../management/get-devices.mjs";
import { config } from "dotenv";
import path from "path";
config({
  path: process.env.CONFIG_PATH || path.resolve(process.cwd(), ".env"),
});

const wsBaseUrl = process.env.WS_BASE_URL || "wss://api.akenza.io";
const apiKey = process.env.API_KEY;
const subscriptions = [];

const devices = await loadAllEntities((pageNumber) => loadDevices(pageNumber));
devices.forEach((device) =>
  subscriptions.push({ assetId: device.id, topic: "*" })
);

const ws = new WebSocket(`${wsBaseUrl}/v3/data-streams?xApiKey=${apiKey}`, {
  maxPayload: 1024 * 1024,
});

ws.on("open", function open() {
  console.log("connected to akenza data stream.");

  function subscribe() {
    let subscription = {
      type: "subscribe",
      id: 1,
      subscriptions: subscriptions,
    };

    const subscriptionPayload = JSON.stringify(subscription);
    const byteLength = Buffer.byteLength(subscriptionPayload, "utf8");
    console.log(`calling subscribe with ${byteLength} bytes`);

    ws.send(subscriptionPayload, (err) => {
      if (err) {
        console.log("could not subscribe");
      } else {
        console.log("subscribed");
      }
    });
  }

  subscribe();
});

let messageCounter = 0;
ws.on("message", function incoming(message) {
  message = JSON.parse(message);
  console.log(message);
  messageCounter = messageCounter + 1;
  if (messageCounter % 10 === 0) {
    console.log(`received ${messageCounter} messages`);
  }
});

ws.on("error", function incoming(error) {
  console.log(`an error occurred ${error}`);
});

ws.on("close", function incoming(code, reason) {
  console.log(`connection closed with code ${code} and reason ${reason}`);
});
