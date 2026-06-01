/**
 * Example that fetches the most recent data point for a device.
 */
import axios from "axios";
import { isRunDirectly } from "../utils.mjs";

const apiKey = process.env.API_KEY;
const akenzaDeviceId = process.env.AKENZA_DEVICE_ID;
const baseUrl = process.env.BASE_URL || "https://api.akenza.io";
const options = {
  headers: { "x-api-key": apiKey, "Content-Type": "application/json" },
};

export async function queryLatest(topic = "*") {
  const url = `${baseUrl}/v3/devices/${akenzaDeviceId}/query`;
  const body = { topic, limit: 1, skip: 0 };

  console.log(`querying latest data for device ${akenzaDeviceId}`);
  const response = await axios.post(url, body, options);
  return response.data;
}

if (isRunDirectly(import.meta)) {
  const data = await queryLatest();
  console.log(JSON.stringify(data, null, 2));
}
