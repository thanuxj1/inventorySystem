import axios from 'axios'; 
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Nav from '../orderManagement/Nav/Nav'; // Import the Nav component
import './AddUser.css'; // Import the CSS file for styling
import emailjs from 'emailjs-com';

const packageValues = {
    platinum: 100000,
    gold: 50000,
    silver: 30000,
    bronze: 15000
};

function AddUser() {
    const navigate = useNavigate();
    const [inputs, setInputs] = useState({
        CID: "",  // Customer ID
        package: "gold",  // Default value
        discount: "",
        extra: "",
        type: "", // Payment type
        date: "",
        gmail: "",
        total: 0  // Add total to state
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setInputs((prevState) => {
            const updatedInputs = {
                ...prevState,
                [name]: value,
            };
            if (name === 'package' || name === 'extra' || name === 'discount') {
                updatedInputs.total = calculateTotal(
                    updatedInputs.package,
                    updatedInputs.extra,
                    updatedInputs.discount
                );
            }
            return updatedInputs;
        });
    };

    const calculateTotal = (packageType, extra, discount) => {
        const packageValue = packageValues[packageType] || 0;
        return (packageValue + (Number(extra) || 0) - (Number(discount) || 0));
    };

    useEffect(() => {
        // Initial calculation if default values are set
        setInputs(prevState => ({
            ...prevState,
            total: calculateTotal(prevState.package, prevState.extra, prevState.discount)
        }));
    }, []);

    const handleSubmit = (e) => {
        e.preventDefault();
        sendRequest()
            .then(() => navigate('/data'))
            .catch(error => console.error('Submission failed:', error));
    };

    const sendRequest = async () => {
        try {
            const response = await axios.post("http://localhost:1999/users", {
                CID: Number(inputs.CID),
                package: String(inputs.package),
                discount: Number(inputs.discount),
                extra: Number(inputs.extra),
                type: String(inputs.type),
                date: new Date(inputs.date),  // Convert to Date object
                gmail: String(inputs.gmail),
                total: inputs.total  // Include total in request
            });
            return response.data;
        } catch (error) {
            console.error("Error submitting data:", error);  // Log the full error object
            if (error.response) {
                console.error("Response data:", error.response.data);
                console.error("Response status:", error.response.status);
                console.error("Response headers:", error.response.headers);
                alert(`Failed to submit data: ${error.response.data.message || 'Server error'}`);
            } else if (error.request) {
                console.error("No response received:", error.request);
                alert('No response from server. Please check your network or try again later.');
            } else {
                console.error("Error setting up request:", error.message);
                alert(`Request setup failed: ${error.message}`);
            }
        }
    };

    const handleGmailSend = async (e) => {
        e.preventDefault();
        try {
            await emailjs.send(
                'service_m5yu168',  // Replace with your EmailJS service ID
                'template_utt6mij',  // Replace with your EmailJS template ID
                {
                    to_email: inputs.gmail,  // Access the inputs state correctly
                    message: 'Your payment has been added to the system!',
                    from_name: 'dhaniya flora'  // Optional
                },
                'Sv8Nb3uEsvOwlOd_7'  // Replace with your EmailJS user ID
            );
            alert('Email sent successfully!');
        } catch (error) {
            console.error('Error sending email:', error);
            alert('Failed to send email.');
        }
    };

    return (
        <div>
            <Nav /> {/* Include the navigation bar */}
            <div className="add-user-container">
                <h1>Add an order</h1>
                <form onSubmit={handleSubmit} className="add-user-form">
                    <label>CID</label>
                    {/* Replaced the select dropdown with an input for manual CID entry */}
                    <input
                        type="text"
                        name="CID"
                        placeholder="Enter Customer ID"
                        onChange={handleChange}
                        value={inputs.CID}
                        required
                    />

                    <label>Package</label>
                    <select
                        name="package"
                        onChange={handleChange}
                        value={inputs.package}
                        required
                    >
                        <option value="gold">Gold</option>
                        <option value="platinum">Platinum</option>
                        <option value="silver">Silver</option>
                        <option value="bronze">Bronze</option>
                    </select>

                    <label>Discount</label>
                    <input
                        type="number"
                        name="discount"
                        onChange={handleChange}
                        value={inputs.discount}
                        required
                    />

                    <label>Extra Charges</label>
                    <input
                        type="number"
                        name="extra"
                        onChange={handleChange}
                        value={inputs.extra}
                        required
                    />

                    <label>Total</label>
                    <input
                        type="number"
                        name="total"
                        value={inputs.total}
                        readOnly  // Make the total field read-only
                    />

                    <label>Payment Type</label>
                    <select
                        name="type"
                        onChange={handleChange}
                        value={inputs.type}
                        required
                    >
                        <option value="" disabled>Select Payment Type</option>
                        <option value="cash">Cash</option>
                        <option value="card">Card</option>
                    </select>

                    <label>Date</label>
                    <input
                        type="date"
                        name="date"
                        onChange={handleChange}
                        value={inputs.date}
                        required
                    />

                    <label>G-Mail</label>
                    <input
                        type="email"
                        name="gmail"
                        onChange={handleChange}
                        value={inputs.gmail}
                        required
                    />

                    <button type="button" onClick={handleGmailSend} className="action-button">
                        Send Email
                    </button>
                    <button type="submit" className="submit-button">
                        Submit
                    </button>
                </form>
            </div>
        </div>
    );
}

export default AddUser;
