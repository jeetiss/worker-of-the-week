import React from "react";
import styles from "./layout.css";

export default ({ children }) => (
  <>
    <h1 className="header">Worker of the week</h1>
    <main className="layout">{children}</main>
  </>
);
