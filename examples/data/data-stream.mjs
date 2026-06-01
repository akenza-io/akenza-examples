/**
 * Example to subscribe to the data stream API.
 */
import WebSocket from "ws";
import { loadAllEntities } from "../utils.mjs";
import { loadDevices } from "../management/get-devices.mjs";

const wsBaseUrl = process.env.WS_BASE_URL || "wss://api.akenza.io";
const apiKey = process.env.API_KEY;

const devices = await loadAllEntities((pageNumber) => loadDevices(pageNumber));
const subscriptions = devices.map((device) => ({
  assetId: device.id,
  topic: "*",
}));

const ws = new WebSocket(`${wsBaseUrl}/v3/data-streams?xApiKey=${apiKey}`, {
  maxPayload: 1024 * 1024,
});

ws.on("open", () => {
  console.log("connected to akenza data stream");
  const payload = JSON.stringify({ type: "subscribe", id: 1, subscriptions });
  console.log(`subscribing with ${Buffer.byteLength(payload, "utf8")} bytes`);
  ws.send(payload, (err) => {
    console.log(err ? "could not subscribe" : "subscribed");
  });
});

let messageCounter = 0;
ws.on("message", (data) => {
  const message = JSON.parse(data);
  console.log(message);
  if (++messageCounter % 10 === 0) {
    console.log(`received ${messageCounter} messages`);
  }
});

ws.on("error", (error) => {
  console.error(`error: ${error}`);
});

ws.on("close", (code, reason) => {
  console.log(`connection closed with code ${code} and reason ${reason}`);
});
