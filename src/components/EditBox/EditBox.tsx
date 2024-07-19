import React, { useContext } from "react";
import classes from "./EditBox.module.css";
import { Canvas, FabricImage, FabricObject, Rect } from "fabric";

const CANVAS_WIDTH = 1000;
const CANVAS_HEIGHT = 600;

export default function EditBox() {
  // const fabricCanvasRef = React.useRef<Canvas | null>(new Canvas());
  // const canvasElementREf = React.useRef<HTMLCanvasElement>(null);

  // React.useEffect(() => {
  //   const initFabric = () => {
  //     if (fabricCanvasRef.current && canvasElementREf.current) {
  //       fabricCanvasRef.current = new Canvas(canvasElementREf.current);
  //       fabricCanvasRef.current.setWidth(CANVAS_WIDTH);
  //       fabricCanvasRef.current.setHeight(CANVAS_HEIGHT);
  //     }
  //   };

  //   const addObjects = async () => {
  //     if (attachment) {
  //       const canvasData = attachment.content;
  //       // const objects =  await fabric.util.enlivenObjects(canvasData.objects);
  //       if (fabricCanvasRef.current) {
  //         fabricCanvasRef.current.backgroundImage = await FabricImage.fromObject(
  //           canvasData.backgroundImage,
  //         );
  //         if (fabricCanvasRef.current.backgroundImage) {
  //           const zoomRatio =
  //             CANVAS_WIDTH / fabricCanvasRef.current.backgroundImage.getScaledWidth();
  //           fabricCanvasRef.current.setZoom(zoomRatio);
  //           fabricCanvasRef.current.setHeight(
  //             fabricCanvasRef.current.backgroundImage.getScaledHeight() * zoomRatio,
  //           );
  //         }
  //         fabricCanvasRef.current.renderAll();
  //       }
  //       // objects.forEach(obj => fabricCanvasRef.current?.add(obj as FabricObject));
  //     }
  //   };

  //   const disposeFabric = () => {
  //     if (fabricCanvasRef.current) fabricCanvasRef.current.dispose();
  //   };

  //   initFabric();
  //   addObjects();

  //   return disposeFabric;
  // }, []);

  return (
    <div className={classes.main}>
      <div className={classes.canvas_container}>
        {/* <canvas className={classes.canvas} ref={canvasElementREf} /> */}
      </div>
    </div>
  );
}
