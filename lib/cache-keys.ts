export function createProdoctCacheKey(params: {
  categorySlug?: string;
  search?: string;
  page?: number;
  limit?: number;
  sort?: string;
}) {
  const keyParts = ["products"];

  Object.entries(params).forEach(([key, value]) => {
    if (value) keyParts.push(`${key}-${value}`);
  });

  return keyParts.join("-");
}

export function createProductsTags(params: {
  categorySlug?: string;
  search?: string;
}) {
  const tags = ["products"];

  Object.entries(params).forEach(([key, value]) => {
    if (value) tags.push(`${key}-${value}`);
  });

  return tags;
}
