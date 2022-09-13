// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next";
import { CommentBody } from "../../models/typings";

type Data = {
  message: string;
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  const comment: CommentBody = JSON.parse(req.body);

  const mutation = {
    mutations: [
      {
        create: {
          _type: "comment",
          comment: comment.comment,
          username: comment.username,
          profileImg: comment.profileImg,
          tweet: {
            _type: "reference",
            _ref: comment.tweetId,
          },
        },
      },
    ],
  };

  const apiEndpoint = `https://${process.env.NEXT_PUBLIC_SANITY_PROJECT_ID}.api.sanity.io/v2021-10-21/data/mutate/${process.env.NEXT_PUBLIC_SANITY_DATASET}`;

  const result = await fetch(apiEndpoint, {
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${process.env.SANITY_API_TOKEN}`,
    },
    method: "POST",
    body: JSON.stringify(mutation),
  });
  const json = await result.json();
  console.log(json);

  return res.status(200).json({
    message: "done",
  });
}
