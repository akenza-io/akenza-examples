/**
 * Example to send an uplink via CoAP for a device.
 */
import { config } from "dotenv";
import path from "path";
import { isRunDirectly } from "../utils.mjs";
import coap from "coap";
config({
  path: process.env.CONFIG_PATH || path.resolve(process.cwd(), ".env.develop"),
});

const coapDeviceId = process.env.COAP_DEVICE_ID;
const uplinkSecret = process.env.COAP_UPLINK_SECRET;
const hostname = process.env.COAP_HOST || "coap.akenza.io";

export async function sendData() {
  const options = {
    hostname: hostname,
    port: 5683,
    method: "POST",
    pathname: "/v3/capture",
    query: `secret=${uplinkSecret}&deviceId=${coapDeviceId}`,
    options: {
      "Content-Format": "application/json",
    },
  };
  const payload = { co2: 780 };

  console.log(
    `sending device data ${JSON.stringify(
      payload,
      null,
      2
    )} for device ${coapDeviceId}`
  );

  const req = coap.request(options);
  req.write(JSON.stringify(payload));

  return new Promise((resolve, reject) => {
    req.on("response", (res) => {
      resolve(res);
    });

    req.on("error", (err) => {
      reject(err);
    });

    req.end();
  });
}

if (isRunDirectly(import.meta)) {
  const res = await sendData();
  console.log(`data sent, received the following code: ${res.code}`);
}