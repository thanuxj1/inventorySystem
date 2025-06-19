import React, { useState, useEffect } from "react";
import axios from "axios";
import jsPDF from "jspdf";
import "jspdf-autotable";
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
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [paymentType, setPaymentType] = useState("");
  const [packageType, setPackageType] = useState("");
  const [date, setDate] = useState("");
  const [reportRange, setReportRange] = useState(""); // New state for report range
  const [noResults, setNoResults] = useState(false);

  useEffect(() => {
    const getUsers = async () => {
      const data = await fetchHandler();
      setUsers(data);
      setFilteredUsers(data); // Initially, set filteredUsers to all users
    };
    getUsers();
  }, []);

  // Date filter for reports (Last 30 days, Last 7 days, This year)
  const filterByReportRange = (range) => {
    const now = new Date();
    let filteredData = [...users];

    if (range === "last30") {
      const past30Days = new Date();
      past30Days.setDate(now.getDate() - 30);
      filteredData = users.filter((user) => {
        const userDate = new Date(user.date);
        return userDate >= past30Days && userDate <= now;
      });
    } else if (range === "last7") {
      const past7Days = new Date();
      past7Days.setDate(now.getDate() - 7);
      filteredData = users.filter((user) => {
        const userDate = new Date(user.date);
        return userDate >= past7Days && userDate <= now;
      });
    } else if (range === "year") {
      filteredData = users.filter((user) => {
        const userDate = new Date(user.date);
        return userDate.getFullYear() === now.getFullYear();
      });
    }

    return filteredData;
  };

  // Generate and download PDF report
  const generatePDFReport = (data) => {
    const doc = new jsPDF();

    // Add title to PDF
    doc.text("Users Report", 14, 16);
    doc.setFontSize(10);
    doc.text(`Report generated: ${new Date().toLocaleString()}`, 14, 22);

    // Create table in PDF using autoTable
    doc.autoTable({
      head: [["CID", "Package", "Discount", "Extra Charges", "Total", "Payment Type", "Date", "G-Mail"]],
      body: data.map((user) => [
        user.CID,
        user.package,
        user.discount,
        user.extra,
        user.total,
        user.type,
        new Date(user.date).toLocaleDateString(),
        user.gmail,
      ]),
    });

    // Save the PDF with a specific name
    doc.save(`users_report_${new Date().toISOString().slice(0, 10)}.pdf`);
  };

  // Handle report download based on selected range
  const handleReportDownload = () => {
    const reportData = filterByReportRange(reportRange); // Get filtered data by range
    if (reportData.length > 0) {
      setFilteredUsers(reportData); // Set the filtered data
      setNoResults(false);
      generatePDFReport(reportData); // Generate and download the PDF report
    } else {
      setNoResults(true); // No results found for the report
      alert("No data available for the selected range.");
    }
  };

  // Handle filtering for search
const handleSearch = () => {
  const filteredData = users.filter((user) => {
    const matchesCID =
      searchQuery === "" || user.CID.toString().includes(searchQuery);
    const matchesID =
      searchQuery === "" || user._id.toString().includes(searchQuery);
    const matchesPaymentType =
      paymentType === "" || user.type.toLowerCase() === paymentType.toLowerCase();
    const matchesPackageType =
      packageType === "" || user.package.toLowerCase() === packageType.toLowerCase();
    const matchesDate = date === "" || new Date(user.date).toISOString().split('T')[0] === date;

    // Combine matchesCID and matchesID with OR
    return (matchesCID || matchesID) && matchesPaymentType && matchesPackageType && matchesDate;
  });

  setFilteredUsers(filteredData);
  setNoResults(filteredData.length === 0);
};

  return (
    <div className="users-page">
      <Nav /> {/* Add the navigation bar */}
      <div className="users-container">
        <h1 className="users-title">Order Details Display</h1>

        {/* Compact filter options */}
        <div className="filters compact-filters">
          <input
            onChange={(e) => setSearchQuery(e.target.value)}
            type="text"
            name="search"
            placeholder="Search By CID"
            className="search-input compact-input"
            value={searchQuery}
          />
          <select
            onChange={(e) => setPaymentType(e.target.value)}
            value={paymentType}
            className="compact-select"
          >
            <option value="">Payment Type</option>
            <option value="cash">Cash</option>
            <option value="card">Card</option>
          </select>

          <select
            onChange={(e) => setPackageType(e.target.value)}
            value={packageType}
            className="compact-select"
          >
            <option value="">Package</option>
            <option value="gold">Gold</option>
            <option value="platinum">Platinum</option>
            <option value="silver">Silver</option>
            <option value="bronze">Bronze</option>
          </select>

          <input
            type="date"
            onChange={(e) => setDate(e.target.value)}
            value={date}
            className="compact-input"
          />

          <button onClick={handleSearch} className="search-button compact-button">
            Search
          </button>
        </div>

        {noResults ? (
          <div className="no-results">
            <p>No Orders found</p>
          </div>
        ) : (
          <div className="users-list">
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
                {filteredUsers.length > 0 &&
                  filteredUsers.map((user) => (
                    <User key={user._id} user={user} />
                  ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Report Range Selector and Download Button moved here */}
        <div className="report-range" style={{ marginTop: "20px" }}>
          <select
            onChange={(e) => setReportRange(e.target.value)}
            value={reportRange}
            className="compact-select"
          >
            <option value="">Select Report Range</option>
            <option value="last30">Last 30 Days</option>
            <option value="last7">Last 7 Days</option>
            <option value="year">This Year</option>
          </select>

          <button onClick={handleReportDownload} className="action-button">
            Download Report
          </button>
        </div>
      </div>
    </div>
  );
}

export default Users;
