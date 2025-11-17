export default function UserProfile({ count }) {
  return (
    <div style={{ padding: "10px", border: "1px solid black" }}>
      <h3>User Profile</h3>
      <p>Count received (via prop drilling): {count}</p>
    </div>
  );
}
