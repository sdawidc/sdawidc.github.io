import { useState } from "react";
import "./Panel.css";
import ThreeLogo from "./ThreeLogo";

function Panel1({ header, text }) {
  return (
    <>
      <div className="panel">
        <h1>{header}</h1>
        <p>{text}</p>
      </div>
    </>
  );
}

export default Panel1;
