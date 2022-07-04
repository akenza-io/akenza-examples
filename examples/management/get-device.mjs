/**
 * Example that loads a device by akenza id.
 */
import { config } from "dotenv";
import path from "path";
import axios from "axios";
import { isRunDirectly } from "../utils.mjs";
config({
  path: process.env.CONFIG_PATH || path.resolve(process.cwd(), ".env"),
});

const apiKey = process.env.API_KEY;
const baseUrl = process.env.BASE_URL || "https://api.akenza.io";

async function loadDeviceById(akenzaDeviceId) {
  const url = `${baseUrl}/v3/devices/${akenzaDeviceId}`;
  const options = {
    headers: {
      "x-api-key": apiKey,
      "Content-Type": "application/json",
    },
  };

  console.log(`getting device for ${url}`);
  const response = await axios.get(url, options);
  return response.data;
}

async function loadDeviceByDeviceId(deviceId) {
  const url = `${baseUrl}/v3/devices/by-device-id?deviceId=${deviceId}`;
  const options = {
    headers: {
      "x-api-key": apiKey,
      "Content-Type": "application/json",
    },
  };

  console.log(`getting device for ${url}`);
  const response = await axios.get(url, options);
  return response.data;
}

if (isRunDirectly(import.meta)) {
  const akenzaDeviceId = process.env.AKENZA_DEVICE_ID;
  const device = await loadDeviceById(akenzaDeviceId);
  console.log(device.name);

  const deviceId = process.env.DEVICE_ID;
  const secondDevice = await loadDeviceByDeviceId(deviceId);
  console.log(secondDevice.name);
}
