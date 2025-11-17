export default function UserProfile({ username }) {
  return (
    <div style={{ padding: "10px", border: "1px solid black" }}>
      <h3>User Profile</h3>
      <p>Username received via Prop Drilling: {username}</p>
    </div>
  );
}
