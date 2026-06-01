/**
 * Example to send an uplink via HTTP for a device using Shared Access Signatures.
 */
import crypto from "crypto";
import axios from "axios";
import { isRunDirectly } from "../utils.mjs";
import { generateSensorReading } from "./iot-data.mjs";

const deviceId = process.env.HTTP_SAS_DEVICE_ID;
const deviceConnectorId = process.env.HTTP_SAS_DEVICE_CONNECTOR_ID;
const signingKey = process.env.HTTP_SAS_SIGNING_KEY;
const baseUrl = process.env.DATA_BASE_URL || "https://data-gateway.akenza.io";

function generateSasToken(
  key,
  resourceUri,
  expiryInSeconds,
  deviceConnectorIdAudience,
  deviceIdAudience,
) {
  let query = `deviceConnectorIdAudience=${deviceConnectorIdAudience}\n`;
  if (deviceIdAudience !== null) {
    query += `deviceIdAudience=${deviceIdAudience}\n`;
  }
  query += `expiry=${expiryInSeconds}`;

  const hmac = crypto.createHmac("sha256", Buffer.from(key, "base64url"));
  hmac.update(encodeURIComponent(query));
  const signature = encodeURIComponent(hmac.digest("base64"));
  const token = `sig=${signature}&exp=${expiryInSeconds}&aud=${encodeURIComponent(resourceUri)}`;
  return Buffer.from(token).toString("base64");
}

export async function sendData() {
  const expiry = Math.ceil(Date.now() / 1000 + 60 * 60 * 24); // 1 day
  const resourceUri = `https://akenza.io/device-connectors/${deviceConnectorId}/devices/${deviceId}`;
  const token = generateSasToken(
    signingKey,
    resourceUri,
    expiry,
    deviceConnectorId,
    deviceId,
  );
  const url = `${baseUrl}/v3/capture?deviceId=${deviceId}&topic=default&sasToken=${token}`;
  const body = generateSensorReading();
  console.log(`sending ${JSON.stringify(body)} for device ${deviceId}`);
  const response = await axios.post(url, body, {
    headers: { "Content-Type": "application/json" },
  });
  return response.data;
}

if (isRunDirectly(import.meta)) {
  await sendData();
  console.log("done");
}
