import Icon from "./Icon";

export default function Header({ username }) {
  return (
    <div style={{ background: "#eee", padding: "10px" }}>
      <h2>Header Component</h2>
      <Icon username={username} />
    </div>
  );
}
