import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import * as Yup from "yup";
import styles from "./signup.module.css";
import {
  getAuth,
  createUserWithEmailAndPassword,
  updateProfile,
} from "firebase/auth";
import { getFirestore, doc, setDoc, collection } from "firebase/firestore";
import firebaseApp from "../../firebaseConfig";

const Signup = () => {
  const navigate = useNavigate();

  const initialFormData = {
    username: "",
    age: "",
    email: "",
    password: "",
  };

  const [formData, setFormData] = useState(initialFormData);

  const initialErrors = {
    username: "",
    age: "",
    email: "",
    password: "",
  };

  const [errors, setErrors] = useState(initialErrors);

  const [isFormSubmitted, setIsFormSubmitted] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });

    // to clear the error when the user starts typing
    setErrors({
      ...errors,
      [name]: "",
    });
  };

  const handleBlur = (e) => {
    const { name, value } = e.target;
    let ageValid = true;

    // to check if the age input can be converted to a valid integer
    if (name === "age" && value.trim() !== "") {
      const ageInt = parseInt(value, 10);
      if (isNaN(ageInt) || ageInt.toString() !== value) {
        ageValid = false;
      }
    }

    const schema = Yup.object().shape({
      username: Yup.string()
        .matches(/^[A-Za-z ]*$/, "Invalid username")
        .required("Required"),
      age: Yup.number("Invalid age")
        .test("is-integer", "Invalid age", () => ageValid)
        .required("Required"),
      email: Yup.string().email("Invalid email").required("Required"),
      password: Yup.string()
        .min(6, "Password must be at least 6 characters long")
        .required("Required"),
    });

    schema
      .validateAt(name, { [name]: value })
      .then(() => {
        setErrors({
          ...errors,
          [name]: "",
        });
      })
      .catch((error) => {
        setErrors({
          ...errors,
          [name]: error.errors[0],
        });
      });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsFormSubmitted(true);

    if (Object.values(errors).some((error) => error)) {
      return;
    }

    try {
      const auth = getAuth(firebaseApp);

      // to create a new user account
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        formData.email,
        formData.password
      );

      await updateProfile(userCredential.user, {
        displayName: formData.username,
      });

      const db = getFirestore();
      // const userRef = doc(db, "users", userCredential.user.uid); // Test
      const usersCollection = collection(db, "users");
      const userDoc = doc(usersCollection, userCredential.user.uid);
      await setDoc(userDoc, {
        name: formData.username,
        age: formData.age,
        email: formData.email,
      });

      // to reset the form and clear validation errors
      setFormData(initialFormData);
      setErrors(initialErrors);

      navigate("/login");

      console.log("User created:", userCredential.user.uid);

      // to clear any previous error message
      console.error("");
    } catch (error) {
      console.error("Error creating user:", error.message);
    }
  };

  return (
    <div>
      <div className={styles.header}>
        <Link to="/login" className={styles.loginLink}>
          Login
        </Link>
      </div>
      <div className={styles.container}>
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            name="username"
            placeholder="Username"
            value={formData.username}
            onChange={handleChange}
            onBlur={handleBlur}
            className={styles.inputField}
          />

          <input
            type="text"
            name="age"
            placeholder="Age"
            value={formData.age}
            onChange={handleChange}
            onBlur={handleBlur}
            className={styles.inputField}
          />

          <input
            type="email"
            name="email"
            placeholder="Email"
            value={formData.email}
            onChange={handleChange}
            onBlur={handleBlur}
            className={styles.inputField}
          />

          <input
            type="password"
            name="password"
            placeholder="Password"
            value={formData.password}
            onChange={handleChange}
            onBlur={handleBlur}
            className={styles.inputField}
          />

          <button type="submit" className={styles.signupButton}>
            Sign Up
          </button>
        </form>
        {isFormSubmitted && Object.values(errors).some((error) => error) && (
          <div className={styles.errorMessage}>
            All fields are mandatory <br />
            Username can only include letters <br />
            Age must be a whole number <br />
            Password must be a minimum of 6 characters <br />
            Email must be in a valid format (e.g., test@test.com)
          </div>
        )}
      </div>
    </div>
  );
};

export default Signup;
