import { useState } from "react";
import Header from "./Header";

export default function App() {
  const [count, setCount] = useState(0);

  return (
    <div style={{ textAlign: "center", marginTop: "40px" }}>
      <h1>Counter App + Prop Drilling</h1>
      <h2>{count}</h2>
      <button onClick={() => setCount(count + 1)}>Increment</button>
      <hr />
      <Header count={count} />
    </div>
  );
}
