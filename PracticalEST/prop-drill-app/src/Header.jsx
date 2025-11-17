import Icon from "./Icon";

export default function Header({ count }) {
  return (
    <div style={{ background: "#eee", padding: "10px" }}>
      <h2>Header Component</h2>
      <Icon count={count} />
    </div>
  );
}
