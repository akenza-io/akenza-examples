import { config } from "dotenv";
import path from "path";
import esMain from "es-main";

config({
  path: process.env.CONFIG_PATH || path.resolve(process.cwd(), ".env"),
});

export async function loadAllEntities(loadFunc) {
  let pageNumber = 0;
  let hasNext = true;
  const entities = [];
  while (hasNext) {
    const page = await loadFunc(pageNumber);
    hasNext = !page.last;
    pageNumber++;
    entities.push(...page.content);
  }
  return entities;
}

export function isRunDirectly(meta) {
  return esMain(meta);
}
