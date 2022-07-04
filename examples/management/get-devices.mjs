/**
 * Example that loads all devices for a given workspace.
 */
import { config } from "dotenv";
import path from "path";
import axios from "axios";
import { loadAllEntities, isRunDirectly } from "../utils.mjs";
config({
  path: process.env.CONFIG_PATH || path.resolve(process.cwd(), ".env"),
});

const apiKey = process.env.API_KEY;
const workspaceId = process.env.WORKSPACE_ID;
const baseUrl = process.env.BASE_URL || "https://api.akenza.io";

export async function loadDevices(pageNumber, pageSize = 100) {
  const url = `${baseUrl}/v3/assets?workspaceId=${workspaceId}&page=${pageNumber}&size=${pageSize}&type=DEVICE`;
  const options = {
    headers: {
      "x-api-key": apiKey,
      "Content-Type": "application/json",
    },
  };

  console.log(`getting devices for ${url}`);
  const response = await axios.get(url, options);
  return response.data;
}

if (isRunDirectly(import.meta)) {
  const devices = await loadAllEntities((pageNumber) =>
    loadDevices(pageNumber)
  );
  console.log(devices.map((d) => d.name));
}
