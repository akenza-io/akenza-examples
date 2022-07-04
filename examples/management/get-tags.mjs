/**
 * Example that loads all tags for a given workspace.
 */
import { config } from "dotenv";
import path from "path";
import axios from "axios";
import { isRunDirectly, loadAllEntities } from "../utils.mjs";

config({
  path: process.env.CONFIG_PATH || path.resolve(process.cwd(), ".env"),
});

const apiKey = process.env.API_KEY;
const workspaceId = process.env.WORKSPACE_ID;
const baseUrl = process.env.BASE_URL || "https://api.akenza.io";

export async function loadTags(pageNumber, pageSize = 100) {
  const url = `${baseUrl}/v3/tags?workspaceId=${workspaceId}&page=${pageNumber}&size=${pageSize}`;
  const options = {
    headers: {
      "x-api-key": apiKey,
      "Content-Type": "application/json",
    },
  };

  console.log(`getting tags for ${url}`);
  const response = await axios.get(url, options);
  return response.data;
}

if (isRunDirectly(import.meta)) {
  const tags = await loadAllEntities((pageNumber) => loadTags(pageNumber));
  console.log(tags.map((d) => d.name));
}
