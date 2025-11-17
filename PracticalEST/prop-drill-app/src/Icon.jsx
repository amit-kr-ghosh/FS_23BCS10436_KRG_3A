import UserProfile from "./UserProfile";

export default function Icon({ count }) {
  return (
    <div>
      <p>🔔 Icon Component</p>
      <UserProfile count={count} />
    </div>
  );
}
