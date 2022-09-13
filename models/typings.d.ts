export interface Tweet extends TweetBody {
  _id: string;
  _createdAt: string;
  _updatedAt: string;
  _rev: string;
  _type: "tweet";
}

export type TweetBody = {
  text: string;
  username: string;
  profileImg: string;
  blockTweet: boolean;
  image?: string;
};

export type CommentBody = {
  comment: string;
  tweetId: string;
  username: string;
  profileImg: string;
};

export interface Comment extends CommentBody {
  _id: string;
  _createdAt: string;
  _updatedAt: string;
  _rev: string;
  _type: "comment";
  tweet: {
    _ref: string;
    _type: "reference";
  };
}
