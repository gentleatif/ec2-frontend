"use client";
import React, { useEffect, useState } from "react";
import AddUserForm from "../components/addUser";
interface User {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
  profileImageUrl: string;
}

const UserPage = () => {
  const url = "https://user-ec2-nest.onrender.com/user";

  // const url = "http://localhost:3001/user";
  const [users, setUsers] = useState<User[]>([]);
  // const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchUsers = () => {
    // setLoading(true); // Start loading
    fetch(url, {
      method: "GET",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error("Failed to fetch users");
        }
        return response.json(); // Parse JSON
      })
      .then((data) => {
        setUsers(data); // Update state with fetched users
      })
      .catch((error) => {
        console.error("Error fetching users:", error);
        setError("Some Error Occurs"); // Store error
      })
      .finally(() => {
        setLoading(false); // End loading
      });
  };

  useEffect(() => {
    fetchUsers();
  }, []); // Empty dependency array ensures this runs only once after the component mounts

  if (loading) return <p>Loading users...</p>;
  if (error) return <p>Error: {error}</p>;

  const handleDelete = (userId: string) => {
    console.log(`Delete user with ID: ${userId}`);

    fetch(`${url}/${userId}`, {
      method: "DELETE",
    }).then((res) => {
      console.log(res);
      fetchUsers();
    });
  };

  const handleUpload = (userId: string, file: File) => {
    console.log(`Upload file for user with ID: ${userId}`, file);
  };

  return (
    <div className="container">
      <AddUserForm onUserAdded={fetchUsers} /> {/* Add the form here */}
      <h1>User List</h1>
      <ul className="user-list">
        {users.map((singleUser) => (
          <li className="user-card" key={singleUser._id}>
            {/* <img src={singleUser.profileImageUrl} alt={singleUser.firstName} /> */}
            <div className="user-details">
              <h3>
                {singleUser.firstName} {singleUser.lastName}
              </h3>
              <p>{singleUser.email}</p>
            </div>
            <div className="button-group">
              <button
                className="delete-button"
                onClick={() => handleDelete(singleUser._id)}
              >
                Delete
              </button>
              {/* <label
                htmlFor={`upload-${singleUser._id}`}
                className="upload-label"
              >
                Upload Image
              </label> */}
              <input
                type="file"
                id={`upload-${singleUser._id}`}
                className="upload-input"
                onChange={(e) =>
                  e.target.files &&
                  handleUpload(singleUser._id, e.target.files[0])
                }
              />
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default UserPage;
