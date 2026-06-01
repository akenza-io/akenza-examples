/**
 * Example to send an uplink via MQTT using TLS for a device.
 */
import mqtt from "mqtt";
import { isRunDirectly } from "../utils.mjs";
import { generateSensorReading } from "./iot-data.mjs";

const mqttBrokerUrl = process.env.MQTT_BROKER_URL;
const username = process.env.MQTT_USERNAME;
const password = process.env.MQTT_PASSWORD;
const deviceId = process.env.MQTT_DEVICE_ID;

export async function sendData() {
  const topic = `/up/${password}/id/${deviceId}`; // or `up/${password}/id/${deviceId}`
  const body = generateSensorReading();
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

  await client.publishAsync(topic, JSON.stringify(body));
  console.log(`published to ${mqttBrokerUrl} for user ${username}`);
  await client.endAsync();
}

if (isRunDirectly(import.meta)) {
  await sendData();
}
