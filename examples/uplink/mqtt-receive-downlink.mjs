/**
 * Example to subscribe to a downlink topic via MQTT for a device.
 * Runs until interrupted with Ctrl+C.
 */
import mqtt from "mqtt";
import { isRunDirectly } from "../utils.mjs";

const mqttBrokerUrl = process.env.MQTT_BROKER_URL;
const username = process.env.MQTT_USERNAME;
const password = process.env.MQTT_PASSWORD;
const deviceId = process.env.MQTT_DEVICE_ID;

export async function receiveDownlinks(onMessage) {
  const topic = `/down/${password}/id/${deviceId}/#`;
  const client = await mqtt.connectAsync(`tls://${mqttBrokerUrl}:8883`, {
    connectTimeout: 5_000,
    reconnectPeriod: 0,
    clientId: "akenza-example",
    username,
    password,
  });

  client.on("error", (err) => {
    console.error(`MQTT error: ${err}`);
  });

  await client.subscribeAsync(topic);
  console.log(`subscribed to ${topic} on ${mqttBrokerUrl}`);

  client.on("message", (receivedTopic, payload) => {
    let message;
    try {
      message = JSON.parse(payload.toString());
    } catch {
      message = payload.toString();
    }
    onMessage(receivedTopic, message);
  });

  return () => client.endAsync();
}

if (isRunDirectly(import.meta)) {
  const stop = await receiveDownlinks((topic, message) => {
    console.log(`downlink on ${topic}: ${JSON.stringify(message)}`);
  });

  process.on("SIGINT", async () => {
    console.log("\ndisconnecting...");
    await stop();
    process.exit(0);
  });
}
