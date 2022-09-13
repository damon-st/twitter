// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next";
import { sanityClient } from "../../sanity";
import { groq } from "next-sanity";
import { Comment } from "../../models/typings";

const commentQuery = groq`
*[_type == "comment" && references(*[_type == "tweet" && _id == $tweetId]._id)]{
    _id,
    ...
  } | order(_createdAt desc)
`;

type Data = Comment[];

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  const { tweetId } = req.query;
  let q = (tweetId as string)?.split("drafts.").pop();
  const comments: Comment[] = await sanityClient.fetch(commentQuery, {
    tweetId: q,
  });
  return res.status(200).json(comments);
}
