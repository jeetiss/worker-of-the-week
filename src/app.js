import React, { Suspense } from "react";

import Worker from "./worker";
import Layout from "./layout";
import Data from "./data";

import "./app.css";

const data = {
  first: {
    avatar: "https://avatars2.githubusercontent.com/u/11796486?s=460&v=4",
    username: "First Atamanenko"
  },
  second: {
    avatar: "https://avatars2.githubusercontent.com/u/11796486?s=460&v=4",
    username: "Second Atamanenko"
  },
  third: {
    avatar: "https://avatars2.githubusercontent.com/u/11796486?s=460&v=4",
    username: "Third Atamanenko"
  }
};

export default () => (
  <Layout>
    <Suspense fallback="Loading...">
      <Data>
        {data =>
          Object.values(data).map((user, index) => <Worker {...user} key={index} />)
        }
      </Data>
    </Suspense>
  </Layout>
);
