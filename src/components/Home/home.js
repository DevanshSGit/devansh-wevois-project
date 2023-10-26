import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { getAuth } from "firebase/auth";
import styles from "./home.module.css";

const Home = () => {
  const auth = getAuth();
  const [user, setUser] = useState(null);

  useEffect(() => {
    const authStateChanged = auth.onAuthStateChanged((user) => {
      if (user) {
        setUser(user);
      } else {
        setUser(null);
      }
    });

    return () => {
      authStateChanged();
    };
  }, [auth]);

  if (!user) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <header className={styles.header}>
        <nav>
          <ul>
            <li>
              <Link to="/" className={styles.loginLink}>
                Back to Signup
              </Link>
            </li>
          </ul>
        </nav>
      </header>

      <div className={styles.card}>
        <h2>Welcome, {user.displayName}</h2>
        <p>Name: {user.displayName}</p>
        <p>Email: {user.email}</p>
        <Link to="/users" className={styles.deleteButton}>
          See all Users
        </Link>
      </div>
    </div>
  );
};

export default Home;
