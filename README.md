# Coffee Pastry Log — Cloudflare migration

The existing React interface is preserved. Cloudflare Workers replaces the Express server, and D1 replaces PostgreSQL. No AI service is required. The import includes all 24 supplied records, dated March 10–October 8, 2026, preserving IDs and attendees. The interface still shows the five most recent purchases.

## Set up and publish

Use Node.js 22 or newer. From this folder:

1. Run `npm install`, then `npx wrangler login` to authorize your Cloudflare account.
2. Run `npx wrangler d1 create coffee-pastry-log`.
3. Copy the returned database ID into `wrangler.jsonc`, replacing `REPLACE_WITH_YOUR_DATABASE_ID`.
4. Run `npm run db:local`, then `npm run build`, then `npm run dev` to check locally.
5. Run `npm run db:import` **once against the newly created empty remote database**. This deliberately fails on duplicate IDs instead of overwriting records.
6. Run `npm run deploy`. Wrangler prints the new public address.
7. Check the latest five records and their attendees. Add one genuine coffee run and reload to verify persistence. Compare the remote database count with the expected count using `npx wrangler d1 execute coffee-pastry-log --remote --command="SELECT COUNT(*) FROM coffee_purchases"`.
8. Share the new address with the cycling group. Keep Replit running until the new app is verified. If any records were added to Replit after the CSV export, transfer those before switching.

## Validation completed

- All 24 CSV rows validated and imported into an in-memory SQLite database; latest record verified.
- Worker history/save response contract, invalid input handling, cross-origin rejection, and static routing checked with a mock database.
- Full dependency installation and React build could not be completed in the preparation environment because npm registry access was unavailable. The deployed Cloudflare integration remains to be verified.

## Notes

Choose Cloudflare's free Workers plan. Usage is subject to its current free limits. This remains a public, no-login app like the original. Anyone who knows its URL can read records and submit a purchase. No editing/deleting functionality has been added. The original server files remain for reference but are not deployed; `worker/index.js` is the deployed backend.

Keep `database.sql` private as your migration backup; it is not in the public asset directory. For later backups, export D1 using `npx wrangler d1 export coffee-pastry-log --remote --output=coffee-backup.sql`.
