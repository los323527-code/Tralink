const $ = (id) => document.getElementById(id);
const form = $("shortenForm"), message = $("message"), result = $("result");
let lastShortUrl = "";
form.addEventListener("submit", async (e) => {
  e.preventDefault();
  const url = $("longUrl").value.trim(), customSlug = $("customSlug").value.trim();
  const button = $("shortenBtn");
  button.disabled = true; button.textContent = "កំពុងបង្កើត…";
  message.className = "message"; message.textContent = "";
  result.classList.add("hidden");
  try {
    const response = await fetch("/api/shorten", { method:"POST", headers:{"Content-Type":"application/json"}, body:JSON.stringify({url,customSlug}) });
    const data = await response.json();
    if (!response.ok) throw new Error(data.error || "បង្កើត Link មិនបានទេ។");
    lastShortUrl = data.shortUrl;
    $("shortUrl").textContent = data.shortUrl;
    $("shortUrl").href = data.shortUrl;
    result.classList.remove("hidden");
    message.className = "message success"; message.textContent = "✓ បង្កើត Link បានជោគជ័យ!";
    $("customSlug").value = "";
  } catch (err) { message.className = "message error"; message.textContent = err.message || "មានបញ្ហា Internet។"; }
  finally { button.disabled = false; button.textContent = "✦ កាត់ Link"; }
});
$("copyBtn").addEventListener("click", async () => {
  try { await navigator.clipboard.writeText(lastShortUrl); $("copyBtn").textContent = "បានចម្លង ✓"; }
  catch { $("copyBtn").textContent = "ចម្លងមិនបាន"; }
  setTimeout(() => $("copyBtn").textContent = "ចម្លង", 1800);
});
$("adminForm").addEventListener("submit", async (e) => {
  e.preventDefault();
  const key = $("adminKey").value;
  const msg = $("adminMessage"), rows = $("linkRows");
  msg.className = "message"; msg.textContent = "កំពុងទាញយក…";
  try {
    const response = await fetch("/api/links", {headers:{"x-admin-key":key}});
    const data = await response.json();
    if (!response.ok) throw new Error(data.error || "មើល Link មិនបាន។");
    rows.innerHTML = "";
    if (!data.links.length) rows.innerHTML = '<tr><td colspan="4" class="empty">មិនទាន់មាន Link ទេ។</td></tr>';
    for (const item of data.links) {
      const tr = document.createElement("tr");
      const short = document.createElement("td"), a = document.createElement("a");
      a.href = item.short_url; a.target = "_blank"; a.rel = "noopener"; a.textContent = item.short_url; short.append(a);
      const original = document.createElement("td"); original.className = "original"; original.textContent = item.original_url;
      const clicks = document.createElement("td"); clicks.textContent = item.clicks ?? 0;
      const created = document.createElement("td"); created.textContent = item.created_at ? new Date(item.created_at).toLocaleString() : "—";
      tr.append(short,original,clicks,created); rows.append(tr);
    }
    msg.className = "message success"; msg.textContent = `បង្ហាញ ${data.links.length} Link ចុងក្រោយ។`;
  } catch (err) { msg.className = "message error"; msg.textContent = err.message; }
});