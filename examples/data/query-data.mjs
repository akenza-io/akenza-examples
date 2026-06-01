/**
 * Example that loads data for a device.
 */
import axios from "axios";
import { isRunDirectly } from "../utils.mjs";

const apiKey = process.env.API_KEY;
const akenzaDeviceId = process.env.AKENZA_DEVICE_ID;
const baseUrl = process.env.BASE_URL || "https://api.akenza.io";

export async function queryData() {
  const since = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString();
  const url = `${baseUrl}/v3/devices/${akenzaDeviceId}/query`;
  const body = {
    topic: "*",
    timestamp: { gte: since },
    limit: 100,
    skip: 0,
  };

  console.log(`querying device data: ${url}`);
  const response = await axios.post(url, body, {
    headers: { "x-api-key": apiKey, "Content-Type": "application/json" },
  });
  return response.data;
}

if (isRunDirectly(import.meta)) {
  const data = await queryData();
  console.log(JSON.stringify(data, null, 2));
}
