import React, { useEffect, useState } from "react";
import { Comment, CommentBody, Tweet } from "../models/typings";
import TimeAgo from "react-timeago";
import { fetchComments } from "../utils/fechtComments";
import {
  ChatAlt2Icon,
  HeartIcon,
  SwitchHorizontalIcon,
  UploadIcon,
} from "@heroicons/react/outline";
import { useSession } from "next-auth/react";
import { fetchAddComments } from "../utils/fetchAddComments";
import toast from "react-hot-toast";

interface Props {
  tweet: Tweet;
}

export default function Tweets({ tweet }: Props) {
  const [comments, setComments] = useState<Comment[]>([]);
  const [commentBoxVisible, setCommentBoxVisible] = useState<boolean>(false);
  const [input, setinput] = useState<string>("");

  const refreshComments = async () => {
    const comments: Comment[] = await fetchComments(tweet._id);
    setComments(comments);
  };

  const { data: session } = useSession();

  useEffect(() => {
    refreshComments();
  }, []);

  const handleSubmint = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const toasId = toast.loading("Create comment...");
    const comment: CommentBody = {
      comment: input,
      profileImg: session?.user?.image || "https://links.papareact.com/gll",
      tweetId: tweet._id,
      username: session?.user?.name || "Unokown User",
    };
    await fetchAddComments(comment);
    setinput("");
    setCommentBoxVisible(false);
    toast.success("Creating done!", {
      id: toasId,
    });
    refreshComments();
  };

  return (
    <div className="flex flex-col space-x-3 border-y p-5 border-gray-100">
      <div className="flex space-x-3">
        <img
          className="w-10 h-10 rounded-full object-cover"
          src={tweet.profileImg}
          alt={tweet.text}
        />
        <div>
          <div className="flex items-center space-x-1">
            <p className="mr-1 font-bold">{tweet.username}</p>
            <p className="hidden text-sm text-gray-500 sm:inline">
              @{tweet.username.replace(/\s+/g, "").toLowerCase()}
            </p>
            <TimeAgo
              className="text-sm text-gray-500"
              date={tweet._createdAt}
            />
          </div>
          <p>{tweet.text}</p>
          {tweet.image && (
            <img
              src={tweet.image}
              alt={tweet.text}
              className="m-5 ml-0 mb-1 max-h-60 rounded-lg object-cover shadow-sm"
            />
          )}
        </div>
      </div>
      <div className="mt-5 flex justify-between">
        <div
          onClick={() => setCommentBoxVisible(!commentBoxVisible)}
          className="flex cursor-pointer items-center space-x-3 text-gray-400"
        >
          <ChatAlt2Icon className="h-5 w-5" />
          <p>{comments.length}</p>
        </div>
        <div className="flex cursor-pointer items-center space-x-3 text-gray-400">
          <SwitchHorizontalIcon className="h-5 w-5" />
        </div>
        <div className="flex cursor-pointer items-center space-x-3 text-gray-400">
          <HeartIcon className="h-5 w-5" />
        </div>
        <div className="flex cursor-pointer items-center space-x-3 text-gray-400">
          <UploadIcon className="h-5 w-5" />
        </div>
      </div>
      {/* Comment box logic */}
      {commentBoxVisible && (
        <form onSubmit={handleSubmint} className="mt-3 flex space-x-3">
          <input
            value={input}
            onChange={(e) => setinput(e.target.value)}
            className="flex-1 rounded-lg bg-gray-100 
          p-2 outline-none"
            type="text"
            placeholder="Write to comment"
          />
          <button
            disabled={!input || !session}
            className="text-twitter disabled:text-gray-200"
          >
            Post
          </button>
        </form>
      )}

      {comments?.length > 0 && (
        <div
          className="my-2 mt-5 max-h-44 space-y-5 overflow-y-scroll border-t 
        border-gray-100 p-5 scrollbar-hide"
        >
          {comments.map((c) => (
            <div key={c._id} className="relative flex space-x-2">
              <hr
                className="absolute left-5 top-10 h-8 border-x 
                border-twitter/30"
              />
              <img
                src={c.profileImg}
                className="mt-2 h-7 w-7 rounded-full object-cover"
                alt={c.username}
              />
              <div>
                <div className="flex items-center space-x-1">
                  <p className="mr-1 font-bold ">{c.username}</p>
                  <p className="hidden text-sm text-gray-500 lg:inline">
                    @{c.username.replace(/\s+/g, "").toLowerCase()}
                  </p>
                </div>
                <TimeAgo
                  className="text-sm text-gray-500"
                  date={c._createdAt}
                />
                <p>{c.comment}</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
