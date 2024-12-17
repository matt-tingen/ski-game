import type { Context } from '@netlify/functions';
import dedent from 'dedent';
import { cors } from '../cors';
import { query } from '../query';

// eslint-disable-next-line import/no-default-export
export default cors(async (req: Request, context: Context) => {
  const seed = new URL(req.url).searchParams.get('seed');

  if (!seed) return new Response(null, { status: 400 });

  const result = await query({
    sql: dedent`
        SELECT name, ms FROM records WHERE seed = ? ORDER BY ms ASC;
      `,
    params: [seed],
  });

  return result.success
    ? context.json(result.result[0].results)
    : new Response(null, { status: 500 });
});
