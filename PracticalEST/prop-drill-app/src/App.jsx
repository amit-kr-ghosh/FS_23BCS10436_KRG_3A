import Header from "./Header";

export default function App() {
  const username = "Amit_Ghosh";

  return (
    <div style={{ textAlign: "center", marginTop: "40px" }}>
      <h1>Prop Drilling Example</h1>
      <Header username={username} />
    </div>
  );
}
