"use client";
import React, { useState } from "react";

import styles from "./addUser.module.css";

interface AddUserFormProps {
  onUserAdded: () => void;
}

const AddUserForm: React.FC<AddUserFormProps> = ({ onUserAdded }) => {
  const url = "https://user-ec2-nest.onrender.com/user";
  const [newUser, setNewUser] = useState({
    firstName: "",
    lastName: "",
    email: "",
  });
  const [profileImage, setProfileImage] = useState<File | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState({
    firstName: "",
    lastName: "",
    email: "",
  });

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setNewUser((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setProfileImage(e.target.files[0]);
    }
  };

  const validateForm = () => {
    let valid = true;
    const newErrors = { firstName: "", lastName: "", email: "" };
    if (newUser.firstName.length < 3 || newUser.firstName.length > 20) {
      newErrors.firstName = "First name must be between 3 and 20 characters.";
      valid = false;
    }
    if (newUser.lastName.length < 3 || newUser.lastName.length > 20) {
      newErrors.lastName = "Last name must be between 3 and 20 characters.";
      valid = false;
    }
    if (!/\S+@\S+\.\S+/.test(newUser.email)) {
      newErrors.email = "Invalid email address.";
      valid = false;
    }
    setErrors(newErrors);
    return valid;
  };

  const handleAddUser = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsLoading(true);

    try {
      const response = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newUser), // Sending the new user data
      });

      if (!response.ok) {
        throw new Error("Failed to add user");
      }

      onUserAdded(); // Refresh the user list
      setNewUser({
        firstName: "",
        lastName: "",
        email: "",
      });
      setProfileImage(null);
    } catch (error) {
      console.error("Error adding user:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form className="user-form" onSubmit={handleAddUser}>
      <h2>Add New User</h2>
      <div className="form-group">
        <label htmlFor="firstName">First Name</label>
        <input
          type="text"
          id="firstName"
          name="firstName"
          value={newUser.firstName}
          onChange={handleInputChange}
          placeholder="Enter first name"
          className={styles.userInput}
        />
        {errors.firstName && <p className={styles.error}>{errors.firstName}</p>}
      </div>
      <div className="form-group">
        <label htmlFor="lastName">Last Name</label>
        <input
          type="text"
          id="lastName"
          name="lastName"
          value={newUser.lastName}
          onChange={handleInputChange}
          placeholder="Enter last name"
          className={styles.userInput}
        />
        {errors.lastName && <p className={styles.error}>{errors.lastName}</p>}
      </div>
      <div className="form-group">
        <label htmlFor="email">Email</label>
        <input
          type="email"
          id="email"
          name="email"
          value={newUser.email}
          onChange={handleInputChange}
          placeholder="Enter email"
          className={styles.userInput}
        />
        {errors.email && <p className={styles.error}>{errors.email}</p>}
      </div>

      <button type="submit" className="submit-button" disabled={isLoading}>
        {isLoading ? "Loading..." : "Add User"}
      </button>
    </form>
  );
};

export default AddUserForm;
