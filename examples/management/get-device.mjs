/**
 * Example that loads a device by akenza id.
 */
import axios from "axios";
import { isRunDirectly } from "../utils.mjs";

const apiKey = process.env.API_KEY;
const baseUrl = process.env.BASE_URL || "https://api.akenza.io";
const options = {
  headers: { "x-api-key": apiKey, "Content-Type": "application/json" },
};

export async function loadDeviceById(akenzaDeviceId) {
  const url = `${baseUrl}/v3/devices/${akenzaDeviceId}`;
  console.log(`getting device: ${url}`);
  const response = await axios.get(url, options);
  return response.data;
}

export async function loadDeviceByDeviceId(deviceId) {
  const url = `${baseUrl}/v3/devices/by-device-id?deviceId=${deviceId}`;
  console.log(`getting device: ${url}`);
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
