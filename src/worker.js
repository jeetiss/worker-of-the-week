import React from "react";
import "./worker.css";

export default ({ username, avatar, url, strength }) => (
  <div className="worker">
    <img src={avatar} alt="user face" />

    <a href={url} target="_blank">
      {username}
    </a>

    <div>{strength}</div>
  </div>
);
