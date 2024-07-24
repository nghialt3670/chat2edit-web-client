import Conversation from "../../models/Conversation";
import classes from "./ConvPreview.module.css";
import { useConvStore, useLayoutStore } from "../../stores";

interface ConvPreviewProps {
  conv: Conversation;
}

export default function ConvPreview({ conv }: ConvPreviewProps) {
  const convStore = useConvStore();
  const layoutStore = useLayoutStore();

  const handleClick = () => {
    convStore.setCurrConv(conv);
    layoutStore.toggleSidebar();
  };

  return (
    <div className={classes.main} onClick={handleClick}>
      <div className={classes.title}>{conv.title}</div>
    </div>
  );
}
