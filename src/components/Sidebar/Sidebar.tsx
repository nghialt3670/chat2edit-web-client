import React, { ReactNode, useEffect, useRef } from "react";
import classes from "./Sidebar.module.css";
import { useConvsStore, useLayoutStore, useUserStore } from "../../stores";
import Conv from "../../models/Conv";
import { requestMessages } from "../../api/requestMessages";
import useConvStore from "../../stores/convsStore";
import ConvPreview from "./ConvPreview";

export default function Sidebar() {
  const sideBarRef = useRef<HTMLDivElement>(null);
  const sidebar = useLayoutStore((state) => state.sidebar);
  const { currConvIdx, currConv, oldConvs } = useConvStore((state) => ({
    currConvIdx: state.currConvIdx,
    currConv: state.currConv,
    oldConvs: state.oldConvs,
  }));

  useEffect(() => {
    if (sideBarRef.current)
      sideBarRef.current.classList.toggle(classes.expanded);
  }, [sidebar]);

  const renderConvs = (): ReactNode => {
    return (
      <div className={classes.conversations_container}>
        <ConvPreview key={currConv.id} idx={currConvIdx} conv={currConv} />
        {oldConvs.map((conv, idx) => (
          <ConvPreview key={conv.id} idx={idx} conv={conv} />
        ))}
      </div>
    );
  };

  return (
    <div className={classes.main} ref={sideBarRef}>
      {renderConvs()}
    </div>
  );
}
