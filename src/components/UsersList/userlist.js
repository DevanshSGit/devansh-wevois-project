import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom/dist";
import {
  getFirestore,
  collection,
  query,
  orderBy,
  getDocs,
} from "firebase/firestore";
import firebaseApp from "../../firebaseConfig";
import styles from "./userlist.module.css";

const UsersList = () => {
  const [users, setUsers] = useState([]);
  const [sortBy, setSortBy] = useState("createdAt");

  useEffect(() => {
    const fetchUsers = async () => {
      const db = getFirestore(firebaseApp);
      const usersCollection = collection(db, "users");
      const q = query(usersCollection, orderBy(sortBy));

      try {
        const querySnapshot = await getDocs(q);
        const usersData = [];

        querySnapshot.forEach((doc) => {
          const data = doc.data();
          const name = data.name || "Name not provided";
          const age = data.age || "Age not provided";
          //   console.log(`Name: ${name}, Age: ${age}`);
          usersData.push({
            id: doc.id,
            name,
            age,
          });
        });

        setUsers(usersData);
      } catch (error) {
        console.error("Error fetching users:", error);
      }
    };

    fetchUsers();
  }, [sortBy]);

  const handleSort = (field) => {
    setSortBy(field);
  };

  return (
    <div className={styles.usersListPage}>
      <header className={styles.header}>
        <Link to="/home" className={styles.signupLink}>
          Home
        </Link>
        <Link to="/" className={styles.signupLink}>
          Back to Signup
        </Link>
      </header>
      <div className={styles.buttonContainer}>
        <button
          onClick={() => handleSort("name")}
          className={styles.sortButton}
        >
          Filter by Name
        </button>
        <button onClick={() => handleSort("age")} className={styles.sortButton}>
          Filter by Age
        </button>
      </div>
      <div className={styles.tableContainer}>
        <table className={styles.table}>
          <thead>
            <tr>
              <th>Name</th>
              <th>Age</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user.id}>
                <td>{user.name}</td>
                <td>{user.age}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default UsersList;
