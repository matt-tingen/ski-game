import type { Context } from '@netlify/functions';
import dedent from 'dedent';
import { cors } from '../cors';
import { query } from '../query';

// eslint-disable-next-line import/no-default-export
export default cors(async (req: Request, context: Context) => {
  const { seed, ms, name } = await req.json();

  if (
    !seed ||
    !name ||
    !ms ||
    typeof seed !== 'string' ||
    typeof name !== 'string' ||
    typeof ms !== 'number' ||
    seed.length > 50 ||
    name.length > 50 ||
    ms <= 0
  )
    return new Response(null, { status: 400 });

  const result = await query({
    sql: dedent`
      INSERT INTO records (seed, ms, name)
      VALUES (?,?,?)
      ON CONFLICT(seed, name)
        DO UPDATE SET ms = CASE
          WHEN excluded.ms < records.ms THEN excluded.ms
          ELSE records.ms
        END;
      `,
    params: [seed, ms, name, seed],
  });

  return new Response(null, { status: result.success ? 200 : 500 });
});
