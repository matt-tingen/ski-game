export interface Query {
  sql: string;
  params?: (string | number)[];
}
export interface QueryResponse {
  errors: unknown[];
  messages: unknown[];
  result: {
    meta: {
      changed_db: boolean;
      changes: number;
      duration: number;
      last_row_id: number;
      rows_read: number;
      rows_written: number;
      size_after: number;
    };
    results: unknown[];
    success: boolean;
  }[];
  success: boolean;
}

function verifyString(value: string | undefined): asserts value is string {
  if (!value) throw new Error(`Missing env var ${value}`);
}

const { D1_REST_URL } = process.env;
const { D1_API_TOKEN } = process.env;

verifyString(D1_REST_URL);
verifyString(D1_API_TOKEN);

export const query = async (query: Query) => {
  const response = await fetch(D1_REST_URL, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${D1_API_TOKEN}`,
    },
    body: JSON.stringify(query),
  });

  return (await response.json()) as QueryResponse;
};

export const queryResultResponse = (queryResponse: QueryResponse) => {
  const {
    result: [results],
    success,
  } = queryResponse;

  return new Response(JSON.stringify(results), {
    status: success ? 200 : 500,
  });
};
