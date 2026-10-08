const members = ["Bill", "Dom", "Jim", "Tommy", "Tony"];
const locations = ["Bunbury", "Sook", "Dottie A", "La Promenade", "Other"];
const json = (value, status = 200) => Response.json(value, {status, headers: {"Cache-Control": "no-store"}});
const record = row => ({id: row.id, date: row.date, location: row.location, payer: row.payer, presentMembers: JSON.parse(row.present_members)});
export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    if (!url.pathname.startsWith("/api/")) return env.ASSETS.fetch(request);
    if (url.pathname !== "/api/purchases") return json({message: "Not found"}, 404);
    try {
      if (request.method === "GET") {
        const {results} = await env.DB.prepare("SELECT * FROM coffee_purchases ORDER BY date DESC, id DESC LIMIT 5").all();
        return json(results.map(record));
      }
      if (request.method !== "POST") return json({message: "Method not allowed"}, 405);
      const origin = request.headers.get("Origin");
      if (origin && origin !== url.origin) return json({message: "Invalid origin"}, 403);
      let input;
      try { input = await request.json(); } catch { return json({message: "Invalid JSON"}, 400); }
      const {date, location, payer, presentMembers} = input || {};
      if (typeof date !== "string" || !/^\d{4}-\d{2}-\d{2}$/.test(date) || !Number.isFinite(Date.parse(date)) || new Date(date).toISOString().slice(0,10) !== date || !locations.includes(location) || !members.includes(payer) || !Array.isArray(presentMembers) || presentMembers.length < 1 || presentMembers.length > 5 || presentMembers.some(m => !members.includes(m)) || new Set(presentMembers).size !== presentMembers.length) return json({message: "Please supply a valid date, location, payer and attendees"}, 400);
      const row = await env.DB.prepare("INSERT INTO coffee_purchases (date, location, payer, present_members) VALUES (?, ?, ?, ?) RETURNING *").bind(date, location, payer, JSON.stringify(presentMembers)).first();
      return json(record(row), 201);
    } catch { return json({message: "Internal server error"}, 500); }
  }
};
