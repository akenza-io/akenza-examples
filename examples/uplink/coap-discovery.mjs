import coap from "coap";
import { isRunDirectly } from "../utils.mjs";

const hostname = process.env.COAP_HOST || "coap.akenza.io";

export async function getRoot() {
  console.log(`getting root from ${hostname}`);
  const req = coap.request({
    hostname,
    port: 5683,
    method: "GET",
    pathname: "/",
  });

  return new Promise((resolve, reject) => {
    req.on("response", resolve);
    req.on("error", reject);
    req.end();
  });
}

export async function discovery() {
  const req = coap.request({
    hostname,
    port: 5683,
    method: "GET",
    pathname: "/.well-known/core",
  });

  return new Promise((resolve, reject) => {
    req.on("response", resolve);
    req.on("error", reject);
    req.end();
  });
}

if (isRunDirectly(import.meta)) {
  const rootResult = await getRoot();
  console.log(`root: code=${rootResult.code}\npayload=${rootResult.payload}`);

  const discoveryResult = await discovery();
  console.log(
    `discovery: code=${discoveryResult.code} payload=${discoveryResult.payload}`,
  );
}
