/**
 * Single source of truth for turning a waitlist_signups.product_slug value
 * into an admin-facing label. The database keeps storing raw slugs
 * (newsletter, drop-001-full-zip-hoodie, ...) — this is presentation-only,
 * so nothing here touches existing records or the public signup forms.
 *
 * Add a new product here when it launches; anything not listed falls back
 * to a readable auto-generated label instead of showing the raw slug or
 * breaking the page.
 */
const PRODUCT_INTEREST_LABELS: Record<string, string> = {
  newsletter: "General / Drop Updates",
  "drop-001-full-zip-hoodie": "Full-Zip Hoodie",
  "drop-001-discipline-sweatpants": "Discipline Sweatpants",
};

/**
 * Fallback for a slug not yet in the map above: strips a leading
 * "drop-00N-" prefix if present, then title-cases the rest.
 * "drop-002-leather-jacket" -> "Leather Jacket"; "newsletter-mx" -> "Newsletter Mx".
 */
function humanizeSlug(slug: string): string {
  const withoutDropPrefix = slug.replace(/^drop-\d+-/, "");
  return withoutDropPrefix
    .split("-")
    .filter(Boolean)
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}

export function getProductInterestLabel(slug: string): string {
  return PRODUCT_INTEREST_LABELS[slug] ?? humanizeSlug(slug) ?? slug;
}

/** For building filter dropdowns: label + the real slug to filter/query by. */
export function knownProductInterestOptions(): { slug: string; label: string }[] {
  return Object.entries(PRODUCT_INTEREST_LABELS).map(([slug, label]) => ({ slug, label }));
}
