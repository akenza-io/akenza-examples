/**
 * Example that loads data for a device.
 */
import { config } from "dotenv";
import path from "path";
import axios from "axios";
import { isRunDirectly } from "../utils.mjs";
config({
  path: process.env.CONFIG_PATH || path.resolve(process.cwd(), ".env"),
});

const apiKey = process.env.API_KEY;
const akenzaDeviceId = process.env.AKENZA_DEVICE_ID;
const baseUrl = process.env.BASE_URL || "https://api.akenza.io";

export async function queryData() {
  const url = `${baseUrl}/v3/devices/${akenzaDeviceId}/query`;
  const options = {
    headers: {
      "x-api-key": apiKey,
      "Content-Type": "application/json",
    },
  };
  const body = {
    topic: "*",
    timestamp: {
      gte: "2022-06-30T00:00:00.000Z",
      //   lte: "<dateTime>",
    },
    limit: 100,
    skip: 0,
  };

  console.log(`getting device data for ${url}`);
  const response = await axios.post(url, body, options);
  return response.data;
}

if (isRunDirectly(import.meta)) {
  const data = await queryData();
  console.log(JSON.stringify(data, null, 2));
}
