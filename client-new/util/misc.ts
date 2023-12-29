//


export function calcOffsetSpec(page: number, size: number): {offset: number, size: number} {
  const offset = size * page;
  return {offset, size};
}