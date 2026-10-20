import { db } from "./_supabase.js";
export default async function handler(req, res) {
  try {
    const slug = String(req.query.slug || "").trim();
    if (!/^[a-z0-9-]{3,24}$/.test(slug)) {
      res.statusCode = 404; res.setHeader("Content-Type", "text/plain; charset=utf-8"); return res.end("Link not found");
    }
    const rows = await db(`links?slug=eq.${encodeURIComponent(slug)}&select=id,original_url,clicks&limit=1`);
    if (!rows.length) {
      res.statusCode = 404; res.setHeader("Content-Type", "text/plain; charset=utf-8"); return res.end("Link not found");
    }
    const link = rows[0];
    await db(`links?id=eq.${link.id}`, {
      method: "PATCH",
      headers: { Prefer: "return=minimal" },
      body: JSON.stringify({ clicks: Number(link.clicks || 0) + 1, last_clicked_at: new Date().toISOString() })
    });
    res.statusCode = 302;
    res.setHeader("Location", link.original_url);
    res.setHeader("Cache-Control", "no-store");
    res.end();
  } catch (e) {
    console.error(e);
    res.statusCode = 500; res.setHeader("Content-Type", "text/plain; charset=utf-8"); res.end("Server error");
  }
}