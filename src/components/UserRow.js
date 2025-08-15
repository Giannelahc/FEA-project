// src/components/UserRow.js
import { Link } from "react-router-dom";
import FollowButton from "./FollowButton";

export default function UserRow({ u }) {
  const id = u.id ?? u._id;                          // support either id shape
  const handle = u.handle || u.username || "user";   // safe handle fallback
  const initialFollowing = !!(u.following || u.isFollowing); // optional API flag

  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        padding: "10px 0",
        borderBottom: "1px solid #eee",
      }}
    >
      <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
        {u.avatarUrl ? (
          <img
            src={u.avatarUrl}
            alt={`${u.username || handle} avatar`}
            width={40}
            height={40}
            style={{ borderRadius: "50%", objectFit: "cover" }}
          />
        ) : (
          <div
            style={{
              width: 40,
              height: 40,
              borderRadius: "50%",
              background: "#ddd",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontWeight: 600,
            }}
          >
            {(u.username || handle)?.[0]?.toUpperCase() || "U"}
          </div>
        )}
        <div>
          <div style={{ fontWeight: 600 }}>
            {id ? <Link to={`/users/${id}`}>{u.username || handle}</Link> : (u.username || handle)}
          </div>
          <div style={{ color: "#666" }}>@{handle}</div>
        </div>
      </div>

      {id && (
        <FollowButton userId={id} initialFollowing={initialFollowing} />
      )}
    </div>
  );
}
