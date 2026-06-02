/**
 * Example that loads all devices for a given workspace.
 */
import axios from "axios";
import { loadAllEntities, isRunDirectly } from "../utils.mjs";

const apiKey = process.env.API_KEY;
const workspaceId = process.env.WORKSPACE_ID;
const baseUrl = process.env.BASE_URL || "https://api.akenza.io";
const options = {
  headers: { "x-api-key": apiKey, "Content-Type": "application/json" },
};

export async function loadDevices(pageNumber, pageSize = 100) {
  const url = `${baseUrl}/v3/assets?workspaceId=${workspaceId}&page=${pageNumber}&size=${pageSize}&type=DEVICE`;
  console.log(`getting devices: ${url}`);
  const response = await axios.get(url, options);
  return response.data;
}

if (isRunDirectly(import.meta)) {
  const devices = await loadAllEntities((pageNumber) =>
    loadDevices(pageNumber),
  );
  console.log(devices.map((d) => d.name));
}
