import React from "react";
import { Link } from "react-router-dom"; // Import Link from react-router-dom
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "../User/User.css"; // Import the CSS file for styling

function User(props) {
  const {
    _id,
    CID,
    package: userPackage,
    discount,
    extra,
    type,
    date,
    gmail,
    total,
  } = props.user; // Destructure user object
  const history = useNavigate();

  const deleteHandler = async () => {
    await axios
      .delete(`http://localhost:1999/users/${_id}`)
      .then((res) => res.data)
      .then(() => history("/data"))
      .catch((error) => console.error("Error deleting user:", error));
  };

  return (
    <tr>
      <td>{CID}</td>
      <td>{_id}</td> {/* Display _id as Order ID */}
      <td>{userPackage}</td>
      <td>{discount}</td>
      <td>{extra}</td>
      <td>{total}</td>
      <td>{type}</td>
      <td>{date ? new Date(date).toLocaleDateString() : ""}</td>
      <td>{gmail}</td>
      <td className="user-actions">
        <Link to={`/updateorder/${_id}`} className="update-button">
          Update
        </Link>
        <button className="delete-button" onClick={deleteHandler}>
          Delete
        </button>
      </td>
    </tr>
  );
}

export default User;
