import React, { useEffect, useState } from "react";

const Profile = () => {
  const [profile, setProfile] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      setError("Not logged in");
      return;
    }

    fetch("http://localhost:5000/api/profile", {
      credentials:"include",
            headers: {
        Authorization: `Bearer ${token}`,

      },
    })
      .then((res) => {
        if (!res.ok) throw new Error("Failed to fetch profile");
        return res.json();
      })
      .then((data) => setProfile(data))
      .catch((err) => setError(err.message));
  }, []);

  if (error) return <div>{error}</div>;
  if (!profile) return <div>Loading profile...</div>;

  return (
    <div>
      <h1>Welcome, {profile.userName}</h1>
      <p>Email: {profile.userEmail}</p>
      <p>Gender: {profile.userGender || "N/A"}</p>
      <p>Age: {profile.userAge || "N/A"}</p>
      <p>Phone: {profile.userPhone || "N/A"}</p>
      <p>Address: {profile.userAddress || "N/A"}</p>
    </div>
  );
};

 export default Profile;
// import React, { useEffect, useState } from "react";
// import axios from "axios";

// const Profile = () => {
//   const [profile, setProfile] = useState(null);
//   const [error, setError] = useState("");

//   useEffect(() => {
//     axios
//       .get("http://localhost:5000/api/products", { withCredentials: true })
//       .then((res) => setProfile(res.data))
//       .catch(() => setError("Not logged in"));
//   }, []);

//   if (error) return <div>{error}</div>;
//   if (!profile) return <div>Loading profile...</div>;
//   return (
//     <div>
//       <h1>Welcome, {profile.userName}</h1>
//       {/* ...the rest */}
//     </div>
//   );
// };

// export default Profile;

