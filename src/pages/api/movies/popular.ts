import { NextApiRequest, NextApiResponse } from "next";

const baseUrl = "https://api.themoviedb.org/3";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const headers = { Authorization: `Bearer ${process.env.TMDB_API_KEY}` };
  const response = await fetch(`${baseUrl}/movie/popular`, {
    headers: headers,
  });
  const data = await response.json();

  res.status(200).json(data);
}
