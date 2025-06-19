import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import { useReactToPrint } from "react-to-print";
import "./users.css"; // Import the CSS file for styling
import User from "../User/User"; // Import the User component
import Nav from "../Nav/Nav"; // Import the Nav component

const URL = "http://localhost:1999/users"; // The URL of your API endpoint

const fetchHandler = async () => {
  try {
    const response = await axios.get(URL);
    return response.data.users || [];
  } catch (error) {
    console.error("Error fetching users:", error);
    return [];
  }
};

function Users() {
  const [users, setUsers] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [noResults, setNoResults] = useState(false);
  const componentsRef = useRef();

  useEffect(() => {
    const getUsers = async () => {
      const data = await fetchHandler();
      setUsers(data);
    };
    getUsers();
  }, []);

  const handlePrint = useReactToPrint({
    content: () => componentsRef.current,
    documentTitle: "Users Report",
    onAfterPrint: () => alert("User report successfully downloaded"),
  });

  const handleSearch = () => {
    fetchHandler().then((data) => {
      const filteredUsers = data.filter((user) =>
        Object.values(user).some((field) =>
          field.toString().toLowerCase().includes(searchQuery.toLowerCase())
        )
      );
      setUsers(filteredUsers);
      setNoResults(filteredUsers.length === 0);
    });
  };

  return (
    <div className="users-page">
      <Nav /> {/* Add the navigation bar */}
      <div className="users-container">
        <h1 className="users-title">Order Details Display</h1>
        <div className="search-bar">
          <input
            onChange={(e) => setSearchQuery(e.target.value)}
            type="text"
            name="search"
            placeholder="Search By ID"
            className="search-input"
          />
          <button onClick={handleSearch} className="search-button">
            Search
          </button>
        </div>

        {noResults ? (
          <div className="no-results">
            <p>No Orders found</p>
          </div>
        ) : (
          <div ref={componentsRef} className="users-list">
            <table className="users-table">
              <thead>
                <tr>
                  <th>CID</th>
                  <th>Order ID</th> {/* New column header for Order ID */}
                  <th>Package</th>
                  <th>Discount</th>
                  <th>Extra Charges</th>
                  <th>Total</th>
                  <th>Type</th>
                  <th>Date</th>
                  <th>G-Mail</th>
                  <th>Actions</th>
                </tr>
              </thead>

              <tbody>
                {users.length > 0 &&
                  users.map((user) => <User key={user._id} user={user} />)}
              </tbody>
            </table>
          </div>
        )}

        <div className="actions">
          <button onClick={handlePrint} className="action-button">
            Download Report
          </button>
        </div>
      </div>
    </div>
  );
}

export default Users;
