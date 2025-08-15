// src/components/FollowButton.js
import React, { useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Button } from "antd";
import { followThunk, unfollowThunk } from "../slices/usersSlice";

/**
 * Props:
 * - userId (string)                   [required]
 * - initialFollowing (boolean)        [optional] fallback if store doesn't know yet
 * - size ("small"|"middle"|"large")   [optional] antd button size (default "middle")
 * - className (string)                [optional]
 * - onToggled?(nextFollowing:boolean) [optional] callback after successful toggle
 */
export default function FollowButton({
  userId,
  initialFollowing = false,
  size = "middle",
  className,
  onToggled,
}) {
  const storeRelation = useSelector((s) => s.users.relations?.[userId]);
  const following = useMemo(
    () =>
      typeof storeRelation === "boolean" ? storeRelation : initialFollowing,
    [storeRelation, initialFollowing]
  );

  const [busy, setBusy] = useState(false);
  const dispatch = useDispatch();

  const toggle = async () => {
    if (!userId || busy) return;
    setBusy(true);
    try {
      if (following) {
        await dispatch(unfollowThunk(userId)).unwrap();
        onToggled && onToggled(false);
      } else {
        await dispatch(followThunk(userId)).unwrap();
        onToggled && onToggled(true);
      }
    } catch (err) {
      // Optionally hook into your MessageContext here
      // console.error(err);
    } finally {
      setBusy(false);
    }
  };

  return (
    <Button
      type={following ? "default" : "primary"}
      size={size}
      loading={busy}
      onClick={toggle}
      disabled={!userId}
      className={className}
      aria-pressed={!!following}
    >
      {following ? "Following" : "Follow"}
    </Button>
  );
}
