import { ReactNode, useEffect, useRef } from "react";
import classes from "./Sidebar.module.css";
import { useConvStore, useLayoutStore } from "../../stores";
import { getConv } from "../../api/getConv";
import ConvPreview from "./ConvPreview";

export default function Sidebar() {
  const mainRef = useRef<HTMLDivElement>(null);
  const sidebar = useLayoutStore((state) => state.sidebar);
  const convStore = useConvStore();

  useEffect(() => {
    if (mainRef.current) mainRef.current.classList.toggle(classes.expanded);
  }, [sidebar]);

  const renderConvs = (): ReactNode => {
    const convs = Object.values(convStore.idToConv);
    return (
      <div className={classes.convs_container}>
        {convs.reverse().map((conv) => (
          <ConvPreview key={conv.id} conv={conv} />
        ))}
      </div>
    );
  };

  return (
    <div className={classes.main} ref={mainRef}>
      {renderConvs()}
    </div>
  );
}
