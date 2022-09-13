import type { GetServerSideProps } from "next";
import Head from "next/head";
import Image from "next/image";
import Feed from "../components/Feed";
import Sidebar from "../components/Sidebar";
import Widgets from "../components/Widgets";
import { Tweet } from "../models/typings";
import { fetchTweets } from "../utils/fetchTweets";
import { Toaster } from "react-hot-toast";
interface Props {
  tweets: Tweet[];
}

const Home = ({ tweets }: Props) => {
  return (
    <div className="mx-auto lg:max-w-6xl max-h-screen overflow-hidden">
      <Head>
        <title>Twitter</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Toaster />
      <main className="grid grid-cols-9">
        <Sidebar />
        {/* Sidebar */}
        <Feed tweets={tweets} />
        {/* Feed */}
        <Widgets />
        {/* widgets */}
      </main>
    </div>
  );
};

export default Home;

export const getServerSideProps: GetServerSideProps = async (context) => {
  const tweets = await fetchTweets();

  return {
    props: {
      tweets,
    },
  };
};
