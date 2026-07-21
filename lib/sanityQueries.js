// Shared GROQ projections reused across product route handlers and server components.

// Full product projection — used by authenticated API routes (products/route.js)
// Includes review aggregates (needs auth token to read review documents)
export const PRODUCT_PROJECTION = `{
  ...,
  "createdAt": _createdAt,
  "updatedAt": _updatedAt,
  "collectionId": *[_type == "collection" && _id == ^.collectionId][0]{ _id, name, slug },
  "reviewCount": count(*[_type == "review" && productId == ^._id && status == "approved"]),
  "reviewAvg":   avg(*[_type == "review" && productId == ^._id && status == "approved"].rating)
}`;

// Lightweight card projection for public showcase endpoints (no auth token, CDN-cached)
// Intentionally omits review sub-queries — publicClient cannot read review documents
export const CARD_PROJECTION = `{
  _id, title, slug, price, compareAtPrice,
  "type": productType,
  "image": coalesce(images[0], ""),
  sizes, colors, isAccessory
}`;

// Card projection for authenticated server routes that can also fetch reviews
export const CARD_PROJECTION_WITH_REVIEWS = `{
  _id, title, slug, price, compareAtPrice,
  "type": productType,
  "image": coalesce(images[0], ""),
  sizes, colors, isAccessory,
  "reviewCount": count(*[_type == "review" && productId == ^._id && status == "approved"]),
  "reviewAvg":   avg(*[_type == "review" && productId == ^._id && status == "approved"].rating)
}`;
