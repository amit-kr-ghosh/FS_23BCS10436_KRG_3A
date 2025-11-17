import UserProfile from "./UserProfile";

export default function Icon({ username }) {
  return (
    <div>
      <p>🔔 Icon Component</p>
      <UserProfile username={username} />
    </div>
  );
}
