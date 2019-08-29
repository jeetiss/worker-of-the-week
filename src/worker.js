import React from "react";
import "./worker.css";

export default ({ username, avatar }) => (
  <div className='worker'>
    <img src={avatar} alt="user face" />

    <div>{username}</div>
  </div>
);
