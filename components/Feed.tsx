import React, { useState } from "react";
import { RefreshIcon } from "@heroicons/react/outline";
import TweetBox from "./TweetBox";
import { Tweet } from "../models/typings";
import TweeComponent from "./Tweet";
import { fetchTweets } from "../utils/fetchTweets";
import toast from "react-hot-toast";

interface Props {
  tweets: Tweet[];
}

export default function Feed({ tweets: tweetsProp }: Props) {
  const [tweets, setTweets] = useState<Tweet[]>(tweetsProp);

  const handleRefresh = async () => {
    const refreshToast = toast.loading("Refreshing...");
    const tweets = await fetchTweets();
    setTweets(tweets);
    toast.success("Feed Updated", { id: refreshToast });
  };

  return (
    <div
      className="col-span-7 lg:col-span-5 border-x 
    max-h-screen overflow-y-scroll scrollbar-hide"
    >
      <div className="flex items-center justify-between ">
        <h1 className="p-5 pb-0 text-xl font-bold">Home</h1>
        <RefreshIcon
          onClick={handleRefresh}
          className="mr-5 w-8 h-8 
            cursor-pointer text-twitter 
            transition-all duration-500 ease-out 
            hover:rotate-180 active:scale-125"
        />
      </div>
      {/* TweeBox */}
      <div>
        <TweetBox setTweets={setTweets} />
      </div>
      <div>
        {tweets.map((t) => (
          <TweeComponent key={t._id} tweet={t} />
        ))}
      </div>
    </div>
  );
}
