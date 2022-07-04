import esMain from "es-main";

export async function loadAllEntities(loadFunc) {
  let pageNumber = 0;
  let hasNext = true;
  const entities = [];
  while (hasNext) {
    const page = await loadFunc(pageNumber);
    hasNext = !page.last;
    pageNumber = pageNumber + 1;
    entities.push.apply(entities, page.content);
  }

  return entities;
}

/**
 * Returns true if the file was invoked directly.
 */
export function isRunDirectly(meta) {
  return esMain(meta);
}
