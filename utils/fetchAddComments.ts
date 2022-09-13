import { CommentBody } from "../models/typings";

export const fetchAddComments = async (e: CommentBody) => {
  const result = await fetch("/api/addComment", {
    body: JSON.stringify(e),
    method: "POST",
  });

  const json = await result.json();
  return json;
};
