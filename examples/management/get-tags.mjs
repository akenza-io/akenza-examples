/**
 * Example that loads all tags for a given workspace.
 */
import axios from "axios";
import { isRunDirectly, loadAllEntities } from "../utils.mjs";

const apiKey = process.env.API_KEY;
const workspaceId = process.env.WORKSPACE_ID;
const baseUrl = process.env.BASE_URL || "https://api.akenza.io";

export async function loadTags(pageNumber, pageSize = 100) {
  const url = `${baseUrl}/v3/tags?workspaceId=${workspaceId}&page=${pageNumber}&size=${pageSize}`;
  console.log(`getting tags: ${url}`);
  const response = await axios.get(url, {
    headers: { "x-api-key": apiKey, "Content-Type": "application/json" },
  });
  return response.data;
}

if (isRunDirectly(import.meta)) {
  const tags = await loadAllEntities((pageNumber) => loadTags(pageNumber));
  console.log(tags.map((t) => t.name));
}
