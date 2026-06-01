/**
 * Example that retrieves a bucketed time-series for a device using
 * pre-computed hourly aggregates. Suitable for time spans over 24 hours.
 *
 * bucketInterval uses ISO-8601 duration format, e.g. PT1H, P1D.
 * Minimum bucket size is PT1H. Maximum 730 buckets per response.
 */
import axios from "axios";
import { isRunDirectly } from "../utils.mjs";

const apiKey = process.env.API_KEY;
const akenzaDeviceId = process.env.AKENZA_DEVICE_ID;
const baseUrl = process.env.BASE_URL || "https://api.akenza.io";
const options = {
  headers: { "x-api-key": apiKey, "Content-Type": "application/json" },
};

export async function queryTimeSeries({
  topic = "default",
  dataKey = "temperature",
  accumulator = "AVG",
  bucketInterval = "PT1H",
  fromDate,
  toDate,
} = {}) {
  const to = toDate ?? new Date().toISOString();
  const from =
    fromDate ?? new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString();
  const url = `${baseUrl}/v3/devices/${akenzaDeviceId}/query/aggregated/hourly/time-series`;
  const body = {
    topic,
    dataKey,
    accumulator,
    bucketInterval,
    interval: { from, to },
  };

  console.log(
    `querying ${bucketInterval} time-series for device ${akenzaDeviceId}`,
  );
  const response = await axios.post(url, body, options);
  return response.data;
}

if (isRunDirectly(import.meta)) {
  const result = await queryTimeSeries();
  console.log(JSON.stringify(result, null, 2));
}
