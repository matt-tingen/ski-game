import type { Context } from '@netlify/functions';
import dedent from 'dedent';
import { round } from 'es-toolkit';
import { query } from '../query';

interface LeaderboardRow {
  name: string;
  ms: number;
}

// eslint-disable-next-line import/no-default-export
export default async (req: Request, context: Context) => {
  const seed = new URL(req.url).searchParams.get('seed');

  if (!seed) return new Response(null, { status: 400 });

  const result = await query({
    sql: dedent`
        SELECT name, ms FROM records WHERE seed = ? ORDER BY ms ASC;
      `,
    params: [seed],
  });

  return result.success
    ? context.json(
        (result.result[0].results as LeaderboardRow[]).map((row) => ({
          ...row,
          ms: round(row.ms, -1),
        })),
      )
    : new Response(null, { status: 500 });
};
