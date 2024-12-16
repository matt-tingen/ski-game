import type { Context } from '@netlify/functions';
import dedent from 'dedent';
import { query, queryResultResponse } from '../query';

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

  return queryResultResponse(result);
};
