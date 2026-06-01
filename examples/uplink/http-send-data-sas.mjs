/**
 * Example to send an uplink via HTTP for a device using Shared Access Signatures.
 */
import { config } from "dotenv";
import path from "path";
import crypto from "crypto";
import axios from "axios";
import { isRunDirectly } from "../utils.mjs";
config({
  path: process.env.CONFIG_PATH || path.resolve(process.cwd(), ".env"),
});

const deviceId = process.env.HTTP_SAS_DEVICE_ID;
const deviceConnectorId = process.env.HTTP_SAS_DEVICE_CONNECTOR_ID;
const signingKey = process.env.HTTP_SAS_SIGNING_KEY;
const baseUrl = process.env.DATA_BASE_URL || "https://data-gateway.akenza.io";

const generateSasToken = (
  signingKey,
  resourceUri,
  expiryInSeconds,
  deviceConnectorIdAudience,
  deviceIdAudience
) => {
  let query = `deviceConnectorIdAudience=${deviceConnectorIdAudience}\n`;
  if (deviceIdAudience !== null) {
    query += `deviceIdAudience=${deviceIdAudience}\n`;
  }
  query += `expiry=${expiryInSeconds}`;
  const encodedQuery = encodeURIComponent(query);

  let hmac = crypto.createHmac("sha256", Buffer.from(signingKey, "base64url"));
  hmac.update(encodedQuery);

  let signature = encodeURIComponent(hmac.digest("base64"));
  let token = `sig=${signature}&exp=${expiryInSeconds}&aud=${encodeURIComponent(
    resourceUri
  )}`;
  return Buffer.from(token).toString("base64");
};

export async function sendData() {
  const expiry = Math.ceil(Date.now() / 1000 + 60 * 60 * 24); // 1d
  const resourceUri = `https://akenza.io/device-connectors/${deviceConnectorId}/devices/${deviceId}`;
  const token = generateSasToken(
    signingKey,
    resourceUri,
    expiry,
    deviceConnectorId,
    deviceId
  );
  const url = `${baseUrl}/v3/capture?deviceId=${deviceId}&topic=default&sasToken=${token}`;
  const options = {
    headers: {
      "Content-Type": "application/json",
      //"x-access-signature": token,
    },
  };
  const body = { co2: 780 };

  console.log(
    `sending device data ${JSON.stringify(
      body,
      null,
      2
    )} for device ${deviceId}`
  );
  const response = await axios.post(url, body, options);
  return response.data;
}

if (isRunDirectly(import.meta)) {
  await sendData();
}

console.log("done");
