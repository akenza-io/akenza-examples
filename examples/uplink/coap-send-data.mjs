/**
 * Example to send an uplink via CoAP for a device.
 */
import coap from "coap";
import { isRunDirectly } from "../utils.mjs";

const coapDeviceId = process.env.COAP_DEVICE_ID;
const uplinkSecret = process.env.COAP_UPLINK_SECRET;
const hostname = process.env.COAP_HOST || "coap.akenza.io";

export async function sendData(value) {
  const payload = { co2: value };
  console.log(`sending ${JSON.stringify(payload)} for device ${coapDeviceId}`);
  // https://github.com/coapjs/node-coap?tab=readme-ov-file#requestrequestparams
  const req = coap.request({
    hostname,
    port: 5683,
    method: "POST",
    pathname: "/v3/capture",
    query: `secret=${uplinkSecret}&deviceId=${coapDeviceId}`,
    options: { "Content-Format": "application/json" },
  });
  req.write(JSON.stringify(payload));

  return new Promise((resolve, reject) => {
    req.on("response", resolve);
    req.on("error", reject);
    req.end();
  });
}

if (isRunDirectly(import.meta)) {
  const res = await sendData(780);
  console.log(`response: code=${res.code} payload=${res.payload}`);
}
