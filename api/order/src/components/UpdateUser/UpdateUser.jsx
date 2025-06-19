import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import './updateUser.css'; // Import the CSS file for styling
import Nav from '../Nav/Nav'; // Import the navigation bar

function UpdateUser() {
    const [inputs, setInputs] = useState({
        CID: '', 
        package: '', 
        discount: '', 
        extra: '', 
        type: '', 
        date: '', 
        gmail: ''
    });
    const { id } = useParams(); // Get user ID from the URL
    const navigate = useNavigate();

    // Fetch the user data when the component mounts
    useEffect(() => {
        const fetchUser = async () => {
            try {
                const response = await axios.get(`http://localhost:1999/users/${id}`);
                setInputs(response.data.user); // Populate the form fields with the user data
            } catch (error) {
                console.error("Error fetching user:", error);
            }
        };

        if (id) {
            fetchUser(); // Fetch the user data if ID exists
        }
    }, [id]);

    // Handle input changes and update state
    const handleChange = (e) => {
        setInputs((prevState) => ({
            ...prevState,
            [e.target.name]: e.target.value,
        }));
    };

    // Handle form submission for updating the user
    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await axios.put(`http://localhost:1999/users/${id}`, inputs); // Update user data via API
            navigate('/userdetails'); // Redirect after successful update
        } catch (error) {
            console.error("Error updating user:", error);
        }
    };

    return (
        <div>
            <Nav /> {/* Add the navigation bar here */}
            <div className="update-user-container">
                <h1 className="form-title">Update Order</h1>
                <form onSubmit={handleSubmit} className="update-user-form">
                    <label htmlFor="CID">Customer ID</label>
                    <input
                        id="CID"
                        type="number"
                        name="CID"
                        onChange={handleChange}
                        value={inputs.CID} // Show current CID
                        disabled // Make CID field non-editable
                        required
                    />

                    <label htmlFor="package">Package</label>
                    <select
                        id="package"
                        name="package"
                        onChange={handleChange}
                        value={inputs.package} // Show current package
                        required
                    >
                        <option value="">Select a package</option>
                        <option value="platinum">Platinum</option>
                        <option value="gold">Gold</option>
                        <option value="silver">Silver</option>
                        <option value="bronze">Bronze</option>
                    </select>

                    <label htmlFor="discount">Discount</label>
                    <input
                        id="discount"
                        type="number"
                        name="discount"
                        onChange={handleChange}
                        value={inputs.discount} // Show current discount
                        required
                    />

                    <label htmlFor="extra">Extra Charges</label>
                    <input
                        id="extra"
                        type="number"
                        name="extra"
                        onChange={handleChange}
                        value={inputs.extra} // Show current extra charges
                        required
                    />

                    <label htmlFor="type">Payment Type</label>
                    <input
                        id="type"
                        type="text"
                        name="type"
                        onChange={handleChange}
                        value={inputs.type} // Show current payment type
                        required
                    />

                    <label htmlFor="date">Date</label>
                    <input
                        id="date"
                        type="date"
                        name="date"
                        onChange={handleChange}
                        value={inputs.date} // Show current date
                        required
                    />

                    <label htmlFor="gmail">G-Mail</label>
                    <input
                        id="gmail"
                        type="gmail"
                        name="gmail"
                        onChange={handleChange}
                        value={inputs.gmail} // Show current contact
                        required
                    />

                    <button type="submit" className="submit-button">Update</button>
                </form>
            </div>
        </div>
    );
}

export default UpdateUser;
