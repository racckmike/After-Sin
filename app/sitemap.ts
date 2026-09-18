import type { MetadataRoute } from "next";
import { products } from "@/data/products";
import { collections } from "@/data/collections";
import { editorialEntries } from "@/data/editorial";

const BASE_URL = "https://www.aftersin.shop";

const STATIC_ROUTES = [
  "",
  "/shop",
  "/editorial",
  "/about",
  "/contact",
  "/faq",
  "/shipping",
  "/returns",
  "/privacy",
  "/terms",
];

export default function sitemap(): MetadataRoute.Sitemap {
  const staticEntries = STATIC_ROUTES.map((route) => ({
    url: `${BASE_URL}${route}`,
    changeFrequency: "weekly" as const,
    priority: route === "" ? 1 : 0.6,
  }));

  const productEntries = products.map((p) => ({
    url: `${BASE_URL}/product/${p.slug}`,
    changeFrequency: "weekly" as const,
    priority: 0.9,
  }));

  const collectionEntries = collections.map((c) => ({
    url: `${BASE_URL}/collections/${c.slug}`,
    changeFrequency: "weekly" as const,
    priority: 0.7,
  }));

  const editorialEntriesMapped = editorialEntries.map((e) => ({
    url: `${BASE_URL}/editorial/${e.slug}`,
    changeFrequency: "monthly" as const,
    priority: 0.4,
  }));

  return [...staticEntries, ...productEntries, ...collectionEntries, ...editorialEntriesMapped];
}
