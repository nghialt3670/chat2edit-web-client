import React, { useContext, useEffect, useRef, useState } from "react";
import classes from "./Edit.module.css";
import { Canvas, Rect } from "fabric";
import EditBox from "../../components/EditBox";

export default function Edit() {
  return (
    <div>
      <EditBox />
    </div>
  );
}
