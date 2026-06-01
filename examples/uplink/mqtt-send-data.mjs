/**
 * Example to send an uplink via MQTT for a device.
 */
import mqtt from "mqtt";
import { isRunDirectly } from "../utils.mjs";

const mqttBrokerUrl = process.env.MQTT_BROKER_URL;
const username = process.env.MQTT_USERNAME;
const password = process.env.MQTT_PASSWORD;
const deviceId = process.env.MQTT_DEVICE_ID;

export async function sendData() {
  const topic = `/up/${password}/id/${deviceId}`;
  const body = { co2: 780 };
  const client = await mqtt.connectAsync(`tcp://${mqttBrokerUrl}:1883`, {
    connectTimeout: 5_000,
    reconnectPeriod: 0,
    clientId: "akenza-example",
    username,
    password,
  });

  client.on("error", (err) => {
    console.error(`MQTT error: ${err}`);
  });

  await client.publishAsync(topic, JSON.stringify(body));
  console.log(`published to ${mqttBrokerUrl} for user ${username}`);
  await client.endAsync();
}

if (isRunDirectly(import.meta)) {
  await sendData();
}
