import { db, json, makeSlug, validUrl } from "./_supabase.js";
export default async function handler(req, res) {
  if (req.method !== "POST") return json(res, 405, { error: "Use POST." });
  try {
    const { url, customSlug } = req.body || {};
    if (!validUrl(url)) return json(res, 400, { error: "សូមបញ្ចូល URL ដែលត្រឹមត្រូវ (https:// ឬ http://)." });
    const normalized = new URL(url).toString();
    let slug = String(customSlug || "").trim().toLowerCase();
    if (slug && !/^[a-z0-9-]{3,24}$/.test(slug)) {
      return json(res, 400, { error: "Custom alias ត្រូវមាន 3–24 តួអក្សរ a-z, 0-9 ឬ - ." });
    }
    for (let attempt = 0; attempt < 5; attempt++) {
      const candidate = slug || makeSlug();
      const existing = await db(`links?slug=eq.${encodeURIComponent(candidate)}&select=id&limit=1`);
      if (existing.length) {
        if (slug) return json(res, 409, { error: "ឈ្មោះ Link នេះមានអ្នកប្រើហើយ។ សាកល្បងឈ្មោះផ្សេង។" });
        continue;
      }
      const created = await db("links", {
        method: "POST",
        headers: { Prefer: "return=representation" },
        body: JSON.stringify([{ slug: candidate, original_url: normalized }])
      });
      const base = (process.env.PUBLIC_BASE_URL || `https://${req.headers.host}`).replace(/\/+$/, "");
      return json(res, 201, { slug: candidate, shortUrl: `${base}/${candidate}`, originalUrl: normalized, clicks: created[0]?.clicks ?? 0 });
    }
    return json(res, 503, { error: "មិនអាចបង្កើត slug បានទេ។ សូមសាកល្បងម្ដងទៀត។" });
  } catch (e) {
    console.error(e);
    return json(res, 500, { error: "មានបញ្ហា Server ឬ Database។ សូមពិនិត្យ Environment Variables និង Supabase SQL." });
  }
}