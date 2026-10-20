import { db, json } from "./_supabase.js";
export default async function handler(req, res) {
  if (req.method !== "GET") return json(res, 405, { error: "Use GET." });
  if (!process.env.ADMIN_KEY || req.headers["x-admin-key"] !== process.env.ADMIN_KEY) {
    return json(res, 401, { error: "Admin key មិនត្រឹមត្រូវ។" });
  }
  try {
    const rows = await db("links?select=id,slug,original_url,clicks,created_at,last_clicked_at&order=created_at.desc&limit=100");
    const base = (process.env.PUBLIC_BASE_URL || `https://${req.headers.host}`).replace(/\/+$/, "");
    return json(res, 200, { links: rows.map(x => ({ ...x, short_url: `${base}/${x.slug}` })) });
  } catch (e) {
    console.error(e);
    return json(res, 500, { error: "មិនអាចទាញយក Link បាន។ ពិនិត្យ Database settings។" });
  }
}