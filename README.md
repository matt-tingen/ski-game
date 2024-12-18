# Spicy Slalom

A small 8-bit style game made for a work game jam.

Play as a skier and race down procedurally generated slopes to get a record in the online leaderboard.

## Dev Setup

### Database

Setting up a database is optional, but the leaderboard will have limited functionality if it is not setup.

1. [Create a Cloudflare D1 instance](https://developers.cloudflare.com/d1/get-started/#2-create-a-database).
2. Run the contents of `db.sql` in the D1 instance. This can be done through the Cloudflare dashboard.
3. Create an API key with access to the D1 instance.
4. Add an `.env` file in the root of the repo:

```ini
D1_REST_URL=https://api.cloudflare.com/client/v4/accounts/{your_account_id}/d1/database/{your_database_id}/query
D1_API_TOKEN=...
```

### Run

Install dependencies and launch:

```sh
pnpm i
pnpm add -g netlify-cli

netlify dev
```

If not using a database, netlify can be skipped:

```sh
pnpm i
pnpm start
```
