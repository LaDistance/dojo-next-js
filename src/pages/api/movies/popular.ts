import { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const headers = { Authorization: `Bearer ${process.env.TMDB_BEARER_TOKEN}` };
  const response = await fetch(
    `${process.env.TMDB_API_BASE_URL}/movie/popular`,
    {
      headers: headers,
    }
  );
  const data = await response.json();

  res.status(200).json(data);
}
