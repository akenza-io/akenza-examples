/**
 * Example to send an uplink via HTTP for a device.
 */
import axios from "axios";
import { isRunDirectly } from "../utils.mjs";
import { generateSensorReading } from "./iot-data.mjs";

const httpDeviceId = process.env.HTTP_DEVICE_ID;
const secret = process.env.HTTP_UPLINK_SECRET;
const baseUrl = process.env.DATA_BASE_URL || "https://data-gateway.akenza.io";

export async function sendData() {
  const url = `${baseUrl}/v3/capture?secret=${secret}&deviceId=${httpDeviceId}&topic=default`;
  const body = generateSensorReading();
  console.log(`sending ${JSON.stringify(body)} for device ${httpDeviceId}`);
  const response = await axios.post(url, body, {
    headers: { "Content-Type": "application/json" },
  });
  return response.data;
}

if (isRunDirectly(import.meta)) {
  await sendData();
}
