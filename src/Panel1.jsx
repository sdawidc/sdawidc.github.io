import { useState } from "react";
import "./Panel.css";
import ThreeLogo from "./LeftPanel/ThreeLogo";

function Panel1({ header, text }) {
  return (
    <>
      <div className="panel">
        <h1>{header}</h1>
        <div>{text}</div>
      </div>
    </>
  );
}

export default Panel1;
