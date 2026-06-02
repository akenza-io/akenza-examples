/**
 * Example that queries an aggregated KPI for an explicit list of devices in one request.
 * Equivalent to the tag KPI query but without requiring a tag to be pre-configured.
 */
import axios from "axios";
import { isRunDirectly, loadAllEntities } from "../utils.mjs";
import { loadDevices } from "../management/get-devices.mjs";

const apiKey = process.env.API_KEY;
const baseUrl = process.env.BASE_URL || "https://api.akenza.io";
const options = {
  headers: { "x-api-key": apiKey, "Content-Type": "application/json" },
};

export async function queryBatch(
  deviceIds,
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
  const url = `${baseUrl}/v3/devices/query/batch`;
  const body = {
    deviceIds,
    topic,
    dataKey,
    accumulator,
    interval: { from, to },
  };

  console.log(
    `batch querying ${accumulator}(${dataKey}) for ${deviceIds.length} device(s)`,
  );
  const response = await axios.post(url, body, options);
  return response.data;
}

if (isRunDirectly(import.meta)) {
  const devices = await loadAllEntities((page) => loadDevices(page));
  if (devices.length === 0) {
    console.log("no devices found in workspace");
    process.exit(1);
  }
  const deviceIds = devices.map((d) => d.id);
  const result = await queryBatch(deviceIds);
  console.log(JSON.stringify(result, null, 2));
}
