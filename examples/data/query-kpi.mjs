/**
 * Example that computes a single aggregated metric (KPI) from raw device data.
 * Suitable for time spans under 24 hours.
 *
 * Supported accumulators: MIN, MAX, AVG, SUM, COUNT, FIRST, LAST,
 *   DISTINCT_COUNT, MATCHED_COUNT, UNMATCHED_COUNT, OCCUPANCY
 */
import axios from "axios";
import { isRunDirectly } from "../utils.mjs";

const apiKey = process.env.API_KEY;
const akenzaDeviceId = process.env.AKENZA_DEVICE_ID;
const baseUrl = process.env.BASE_URL || "https://api.akenza.io";

export async function queryKpi({
  topic = "default",
  dataKey = "temperature",
  accumulator = "AVG",
  fromDate,
  toDate,
} = {}) {
  const to = toDate ?? new Date().toISOString();
  const from =
    fromDate ?? new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString();
  const url = `${baseUrl}/v3/devices/${akenzaDeviceId}/query/raw/kpi`;
  const body = { topic, dataKey, accumulator, interval: { from, to } };

  console.log(
    `querying ${accumulator}(${dataKey}) for device ${akenzaDeviceId}`,
  );
  const response = await axios.post(url, body, {
    headers: { "x-api-key": apiKey, "Content-Type": "application/json" },
  });
  return response.data;
}

if (isRunDirectly(import.meta)) {
  const result = await queryKpi();
  console.log(JSON.stringify(result, null, 2));
}
