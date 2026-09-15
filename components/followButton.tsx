import { useState } from "react";

export default function FollowButton() {
  const [following, setFollowing] = useState(false);

  function toggleFollow() {
    setFollowing(prev => !prev);
  }

  return (
    <button
      onClick={toggleFollow}
      className={following ? "follow-btn active" : "follow-btn"}
    >
      {following ? "Volgend" : "Volgen"}
    </button>
  );
}

