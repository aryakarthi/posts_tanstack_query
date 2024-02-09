import { useState } from "react";
import PostList from "./components/PostList";

const App = () => {
  const [toggle, setToggle] = useState(true);
  return (
    <div>
      <h2 className="title">Posts</h2>
      <button onClick={() => setToggle(!toggle)}>Toggle</button>
      {toggle && <PostList />}
    </div>
  );
};

export default App;
