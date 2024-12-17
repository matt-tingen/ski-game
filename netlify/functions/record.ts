import type { Context } from '@netlify/functions';
import dedent from 'dedent';
import { query } from '../query';

const post = async (seed: string, name: string, ms: number) => {
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
    params: [seed, ms, name],
  });

  return new Response(null, { status: result.success ? 200 : 500 });
};

// eslint-disable-next-line import/no-default-export
export default async (req: Request, context: Context) => {
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

  if (name.toUpperCase().startsWith('CHEATER:')) {
    return post(seed, name.slice(0, 50), 1e6);
  }

  if (
    req.headers.get('X-Anti-Cheat') !== 'please use the honor system' ||
    (process.env.MIN_POSSIBLE_MS && ms < Number(process.env.MIN_POSSIBLE_MS))
  ) {
    return post(seed, `CHEATER: ${name}`.slice(0, 50), 1e6);
  }

  // Thank you for behaving
  return post(seed, name, ms);
};
