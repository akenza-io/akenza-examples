/**
 * Example to send an uplink via MQTT for a device.
 */
import mqtt from "async-mqtt";
import { config } from "dotenv";
import path from "path";
config({
  path: process.env.CONFIG_PATH || path.resolve(process.cwd(), ".env"),
});

const mqttBrokerUrl = process.env.MQTT_BROKER_URL;
const username = process.env.MQTT_USERNAME;
const password = process.env.MQTT_PASSWORD;
const deviceId = process.env.MQTT_DEVICE_ID;
const topic = `/up/${password}/id/${deviceId}`;

var options = {
  connectTimeout: 5 * 1000,
  reconnectPeriod: 0,
  clientId: "akenza-example",
  username: username,
  password: password,
};
const body = { co2: 780 };
const client = await mqtt.connectAsync(
  `tcp://${mqttBrokerUrl}:1883`,
  options,
  false
);

client.on("error", (err) => {
  console.log(`error while sending data to MQTT broker ${err}`);
});

try {
  await client.publish(topic, JSON.stringify(body));
  console.log(
    `successfully published message to broker ${mqttBrokerUrl} for user ${username}`
  );

  await client.end();
} catch (e) {
  console.log(e.stack);
  process.exit();
}
