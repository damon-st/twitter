import React from "react";
import {
  BellIcon,
  HashtagIcon,
  BookmarkIcon,
  HomeIcon,
  UserIcon,
  CollectionIcon,
  MailIcon,
  DotsCircleHorizontalIcon,
} from "@heroicons/react/outline";
import SidebarRow from "./SidebarRow";
import { useSession, signIn, signOut } from "next-auth/react";

export default function Sidebar() {
  const { data: session } = useSession();

  return (
    <div className="flex flex-col col-span-2 items-center px-4 md:items-start">
      <img
        className="m-3 h-10 w-10"
        src="https://links.papareact.com/drq"
        alt="twitter"
      />
      <SidebarRow Icon={HomeIcon} title="Home"></SidebarRow>
      <SidebarRow Icon={HashtagIcon} title="Explore"></SidebarRow>
      <SidebarRow Icon={BellIcon} title="Notifications"></SidebarRow>
      <SidebarRow Icon={MailIcon} title="Messages"></SidebarRow>
      <SidebarRow Icon={BookmarkIcon} title="Bookmarks"></SidebarRow>
      <SidebarRow Icon={CollectionIcon} title="List"></SidebarRow>
      <SidebarRow
        onClick={session ? signOut : signIn}
        Icon={UserIcon}
        title={session ? "Sign out " : "Sign In"}
      ></SidebarRow>
      <SidebarRow Icon={DotsCircleHorizontalIcon} title="More"></SidebarRow>
    </div>
  );
}
