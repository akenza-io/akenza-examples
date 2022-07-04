/**
 * Example to send an uplink via HTTP for a device.
 */
import { config } from "dotenv";
import path from "path";
import axios from "axios";
import { isRunDirectly } from "../utils.mjs";
config({
  path: process.env.CONFIG_PATH || path.resolve(process.cwd(), ".env"),
});

const httpDeviceId = process.env.HTTP_DEVICE_ID;
const secret = process.env.HTTP_UPLINK_SECRET;
const baseUrl = process.env.DATA_BASE_URL || "https://data-gateway.akenza.io";

export async function sendData() {
  const url = `${baseUrl}/v3/capture?secret=${secret}&deviceId=${httpDeviceId}&topic=default`;
  const options = {
    headers: {
      "Content-Type": "application/json",
    },
  };
  const body = { co2: 780 };

  console.log(
    `sending device data ${JSON.stringify(
      body,
      null,
      2
    )} for device ${httpDeviceId}`
  );
  const response = await axios.post(url, body, options);
  return response.data;
}

if (isRunDirectly(import.meta)) {
  await sendData();
}
