/**
 * Example that queries an aggregated KPI for every device in a tag group.
 * Returns one result per device, useful for comparing values across a fleet.
 */
import axios from "axios";
import { isRunDirectly } from "../utils.mjs";

const apiKey = process.env.API_KEY;
const baseUrl = process.env.BASE_URL || "https://api.akenza.io";
const options = {
  headers: { "x-api-key": apiKey, "Content-Type": "application/json" },
};

export async function queryTagKpi(
  tagId,
  {
    topic = "default",
    dataKey = "temperature",
    accumulator = "AVG",
    fromDate,
    toDate,
  } = {},
) {
  const to = toDate ?? new Date().toISOString();
  const from =
    fromDate ?? new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString();
  const url = `${baseUrl}/v3/tags/${tagId}/query/aggregated/hourly/accumulated-kpi`;
  const body = { topic, dataKey, accumulator, interval: { from, to } };

  console.log(`querying ${accumulator}(${dataKey}) across tag ${tagId}`);
  const response = await axios.post(url, body, options);
  return response.data;
}

if (isRunDirectly(import.meta)) {
  const result = await queryTagKpi(process.env.TAG_ID);
  console.log(JSON.stringify(result, null, 2));
}
