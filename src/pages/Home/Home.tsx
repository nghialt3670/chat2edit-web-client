import React, { RefObject, useEffect, useRef, useState } from "react";
import classes from "./Home.module.css";
import ChatBox from "../../components/ChatBox";
import { RiSidebarFoldFill, RiSidebarUnfoldFill } from "react-icons/ri";
import { IconButton } from "@mui/material";
import { SignedIn, UserButton } from "@clerk/clerk-react";
import { BiSolidAddToQueue } from "react-icons/bi";

import { Canvas, FabricImage, FabricObject, Group, Textbox } from "fabric";

export default function Home() {
  const [sideBarExpanded, setSideBarExpanded] = useState<boolean>(false);
  const sideBarRef = useRef<HTMLDivElement>(null);

  const toggleSidebar = () => {
    if (sideBarRef.current)
      setSideBarExpanded(sideBarRef.current.classList.toggle(classes.expanded));
  };

  return (
    <div className={classes.main}>
      <ChatBox />
    </div>
  );
}
