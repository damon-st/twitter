import React, { Dispatch, SetStateAction, useRef, useState } from "react";
import {
  CalendarIcon,
  EmojiHappyIcon,
  LocationMarkerIcon,
  PhotographIcon,
  SearchCircleIcon,
} from "@heroicons/react/outline";

import { useSession } from "next-auth/react";
import { Tweet, TweetBody } from "../models/typings";
import { fetchTweets } from "../utils/fetchTweets";
import toast from "react-hot-toast";

interface Props {
  setTweets: Dispatch<SetStateAction<Tweet[]>>;
}

export default function TweetBox({ setTweets }: Props) {
  const [input, setInput] = useState<string>("");
  const imageInputRef = useRef<HTMLInputElement>(null);
  const { data: session } = useSession();
  const [imageUrlBoxIsOpen, setimageUrlBoxIsOpen] = useState<boolean>(false);
  const [image, setImage] = useState<string>("");

  const addImageToTweet = (
    e: React.MouseEvent<HTMLButtonElement, MouseEvent>
  ) => {
    e.preventDefault();
    if (!imageInputRef.current?.value) return;
    setImage(imageInputRef.current.value);
    imageInputRef.current.value = "";
    setimageUrlBoxIsOpen(false);
  };

  const postTweet = async () => {
    const toastId = toast.loading("Creating...");
    const tweetBody: TweetBody = {
      text: input,
      blockTweet: false,
      username: session?.user?.name || "Unknow User",
      profileImg: session?.user?.image || "https://links.papareact.com/gll",
      image: image,
    };

    const result = await fetch(`/api/addTweet`, {
      body: JSON.stringify(tweetBody),
      method: "POST",
    });
    const json = await result.json();
    const newTweets = await fetchTweets();
    setTweets(newTweets);
    toast("Tweet Post", {
      icon: "👏",
      id: toastId,
    });
    return json;
  };

  const handleSumbit = async (
    e: React.MouseEvent<HTMLButtonElement, MouseEvent>
  ) => {
    e.preventDefault();
    await postTweet();
    setInput("");
    setImage("");
    setimageUrlBoxIsOpen(false);
  };

  return (
    <div className="flex space-x-2 p-5">
      <img
        className="h-14 w-14  object-cover rounded-full
        mt-4"
        src={session?.user?.image || "https://links.papareact.com/gll"}
        alt="Profile avatar"
      />
      <div className="flex flex-1 items-center pl-2">
        <form className="flex flex-1 flex-col">
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            className="h-24 w-full text-xl outline-none"
            type="text"
            placeholder="Whats happeing"
          />
          <div className="flex items-center ">
            <div className="flex space-x-2 text-twitter flex-1">
              <PhotographIcon
                onClick={() => setimageUrlBoxIsOpen(!imageUrlBoxIsOpen)}
                className="h-5 w-5 
                        cursor-pointer transition-transform duration-150 
                        ease-out hover:scale-150"
              />
              <SearchCircleIcon className="h-5 w-5" />
              <EmojiHappyIcon className="h-5 w-5" />
              <CalendarIcon className="h-5 w-5" />
              <LocationMarkerIcon className="h-5 w-5" />
            </div>
            <button
              onClick={handleSumbit}
              disabled={!input || !session}
              className="bg-twitter 
                    px-5 py-2 font-bold 
                    text-white rounded-full disabled:opacity-40"
            >
              Tweet
            </button>
          </div>
          {imageUrlBoxIsOpen && (
            <form className="mt-5 flex rounded-lg bg-twitter/80 py-2 px-4">
              <input
                ref={imageInputRef}
                className="flex-1 bg-transparent p-2 text-white 
              outline-none placeholder:text-white"
                type="text"
                placeholder="Enter image Url"
              />
              <button
                onClick={addImageToTweet}
                type="submit"
                className="font-bold text-white"
              >
                Add image
              </button>
            </form>
          )}
          {image && (
            <img
              className="mt-10 h-40 w-full rounded-xl 
            object-contain shadow-lg"
              src={image}
              alt=""
            />
          )}
        </form>
      </div>
    </div>
  );
}
