import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import styles from "./login.module.css";
import { getAuth, signInWithEmailAndPassword } from "firebase/auth";
import { initializeApp, getApps } from "firebase/app";
import firebaseApp from "../../firebaseConfig";

const Login = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [errorMessage, setErrorMessage] = useState("");
  const [isFormSubmitted, setIsFormSubmitted] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      if (!getApps().length) {
        initializeApp(firebaseApp);
      }

      const auth = getAuth();

      const userCredential = await signInWithEmailAndPassword(
        auth,
        formData.email,
        formData.password
      );

      console.log("User logged in:", userCredential.user.uid);

      setErrorMessage("");

      navigate("/home");
    } catch (error) {
      console.error("Login error:", error.message);
      setErrorMessage("Incorrect credentials or account doesn't exist.");
    }
  };

  return (
    <div>
      <div className={styles.header}>
        <Link to="/" className={styles.loginLink}>
          Back to Signup
        </Link>
      </div>
      <div className={styles.container}>
        <form onSubmit={handleSubmit}>
          <input
            type="email"
            name="email"
            placeholder="Email"
            value={formData.email}
            onChange={handleChange}
            className={styles.inputField}
          />
          {isFormSubmitted && errorMessage && (
            <div className={styles.errorMessage}>{errorMessage}</div>
          )}

          <input
            type="password"
            name="password"
            placeholder="Password"
            value={formData.password}
            onChange={handleChange}
            className={styles.inputField}
          />

          <button type="submit" className={styles.signupButton}>
            Login
          </button>
        </form>
        {errorMessage && (
          <div className={styles.errorMessage}>{errorMessage}</div>
        )}
      </div>
    </div>
  );
};

export default Login;
