import type { Context } from '@netlify/functions';

type Handler = (req: Request, context: Context) => Promise<Response>;

export const cors =
  (handler: Handler): Handler =>
  async (req, ctx) => {
    const res = await handler(req, ctx);

    if (process.env.ALLOW_ORIGIN) {
      res.headers.append(
        'Access-Control-Allow-Origin',
        process.env.ALLOW_ORIGIN,
      );
    }

    return res;
  };
