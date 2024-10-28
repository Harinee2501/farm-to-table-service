import React, { useState } from 'react';
import './Login.css'; // Import the CSS file
import { useNavigate } from 'react-router-dom'; // Import useNavigate from react-router-dom

const Login = () => {
    const navigate = useNavigate(); // Initialize useNavigate hook
    const [showAdditionalOptions, setShowAdditionalOptions] = useState(false); // State to control additional options visibility
    const [isLogin, setIsLogin] = useState(true); // State to toggle between Login and Sign Up

    // Function to handle submit
    const handleSubmit = async (e) => {
        e.preventDefault(); // Prevent the default form submission

        const logID = e.target.logID.value; // Access logID directly
        const logpass = e.target.logpass.value; // Access logpass directly
        const signUpRole = e.target.signUpRole?.value; // Get role from sign-up form

        // Create the request payload based on the form type
        let payload;

        if (isLogin) {
            payload = { logID, logpass }; // Payload for login
        } else {
            const additionalInfo = {
                farmerId: e.target.additionalInfo1?.value,
                farmerName: e.target.additionalInfo2?.value,
                location: e.target.additionalInfo3?.value,
                landArea: e.target.additionalInfo4?.value,
                contactNumber: e.target.additionalInfo5?.value,
                email: e.target.additionalInfo6?.value,
            };
            payload = { logID, logpass, signUpRole, ...additionalInfo }; // Payload for sign-up
        }

        try {
            const response = await fetch('http://localhost:5000/api/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(payload),
            });

            const data = await response.json();
            console.log('Response:', response);
            console.log('Data:', data); // Debugging output

            if (response.ok) {
                localStorage.setItem('token', data.token);
                alert(data.message);
                // Redirect based on user role
                if (logID === '100F') {
                    navigate('/farmer-dashboard'); // Redirect to Farmer Dashboard
                } else if (logID === '100D') {
                    navigate('/distributor-dashboard'); // Redirect to Distributor Dashboard
                } else {
                    navigate('/'); // Default redirect for other roles
                }
            } else {
                // Show error message if login fails
                alert(data.message);
            }
        } catch (error) {
            console.error('Error logging in:', error);
            alert('Login failed. Please try again.');
        }
    }

    return (
        <div>
            {/* Navbar Section */}
            <div className="navbar">
                <h1 className="logo">🌱 Farm to Table</h1>
                <nav className="flex space-x-4">
                    <button className="nav-button" onClick={() => navigate("/")}>Home</button>
                    <button className="nav-button" onClick={() => setIsLogin(true)}>Login</button>
                    <button className="nav-button" onClick={() => setIsLogin(false)}>Sign Up</button>
                </nav>
            </div>

            <div className="section">
                <div className="container">
                    <div className="row full-height justify-content-center">
                        <div className="col-12 text-center align-self-center py-5">
                            <div className="section pb-5 pt-5 pt-sm-2 text-center">
                                <h6 className="mb-0 pb-3">
                                    <span onClick={() => setIsLogin(true)}>Log In </span>
                                    <span onClick={() => setIsLogin(false)}>Sign Up</span>
                                </h6>
                                <input className="checkbox" type="checkbox" id="reg-log" checked={!isLogin} onChange={() => setIsLogin(!isLogin)} />
                                <label htmlFor="reg-log"></label>
                                <div className="card-3d-wrap mx-auto">
                                    <div className="card-3d-wrapper">
                                        {isLogin ? (
                                            <div className="card-front">
                                                <div className="center-wrap">
                                                    <div className="section text-center">
                                                        <h4 className="mb-4 pb-3">Log In</h4>
                                                        <form onSubmit={handleSubmit}>
                                                            <div className="form-group">
                                                                <input
                                                                    type="text"
                                                                    name="logID"
                                                                    className="form-style"
                                                                    placeholder="Your ID"
                                                                    id="logID"
                                                                    autoComplete="on"
                                                                    required
                                                                />
                                                                <i className="input-icon uil uil-at"></i>
                                                            </div>
                                                            <div className="form-group mt-3">
                                                                <input
                                                                    type="password"
                                                                    name="logpass"
                                                                    className="form-style"
                                                                    placeholder="Your Password"
                                                                    id="logpass"
                                                                    autoComplete="on"
                                                                    required
                                                                />
                                                                <i className="input-icon uil uil-lock-alt"></i>
                                                            </div>
                                                            <button type="submit" className="btn mt-4">SUBMIT</button>
                                                        </form>
                                                        <p className="mb-0 mt-4 text-center">
                                                            <button type="button" className="link" onClick={() => {/* Handle password recovery */}}>
                                                                Forgot your password?
                                                            </button>
                                                        </p>
                                                    </div>
                                                </div>
                                            </div>
                                        ) : (
                                            <div className="card-back">
                                                <div className="center-wrap">
                                                    <div className="section text-center">
                                                        <h4 className="mb-4 pb-3">Sign Up</h4>
                                                        <form onSubmit={handleSubmit} name="signUpForm">
                                                            <div className="form-group mt-2">
                                                                <select
                                                                    name="signUpRole"
                                                                    className="form-style"
                                                                    id="signUpRole"
                                                                    autoComplete="off"
                                                                    required
                                                                    onChange={(e) => setShowAdditionalOptions(e.target.value === "farmer")}
                                                                >
                                                                    <option value="" disabled>Select your Role</option>
                                                                    <option value="farmer">Farmer</option>
                                                                    <option value="distributor">Distributor</option>
                                                                    <option value="retailer">Retailer</option>
                                                                    <option value="processor">Processor</option>
                                                                    <option value="storage-facility">Storage Facility</option>
                                                                </select>
                                                                <i className="input-icon uil uil-user"></i>
                                                            </div>
                                                            {/* Additional options shown conditionally */}
                                                            {showAdditionalOptions && (
                                                                <div>
                                                                    <div className="form-group mt-2">
                                                                        <input
                                                                            type="text"
                                                                            name="additionalInfo1"
                                                                            className="form-style"
                                                                            placeholder="Farmer ID"
                                                                            id="additionalInfo1"
                                                                            autoComplete="off"
                                                                        />
                                                                        <i className="input-icon uil uil-info-circle"></i>
                                                                    </div>
                                                                    <div className="form-group mt-3">
                                                                        <input
                                                                            type="text"
                                                                            name="additionalInfo2"
                                                                            className="form-style"
                                                                            placeholder="Farmer Name"
                                                                            id="additionalInfo2"
                                                                            autoComplete="off"
                                                                        />
                                                                        <i className="input-icon uil uil-info-circle"></i>
                                                                    </div>
                                                                    <div className="form-group mt-4">
                                                                        <input
                                                                            type="text"
                                                                            name="additionalInfo3"
                                                                            className="form-style"
                                                                            placeholder="Location"
                                                                            id="additionalInfo3"
                                                                            autoComplete="off"
                                                                        />
                                                                        <i className="input-icon uil uil-info-circle"></i>
                                                                    </div>
                                                                    <div className="form-group mt-5">
                                                                        <input
                                                                            type="text"
                                                                            name="additionalInfo4"
                                                                            className="form-style"
                                                                            placeholder="Land Area"
                                                                            id="additionalInfo4"
                                                                            autoComplete="off"
                                                                        />
                                                                        <i className="input-icon uil uil-info-circle"></i>
                                                                    </div>
                                                                    <div className="form-group mt-5">
                                                                        <input
                                                                            type="text"
                                                                            name="additionalInfo5"
                                                                            className="form-style"
                                                                            placeholder="Contact Number"
                                                                            id="additionalInfo5"
                                                                            autoComplete="off"
                                                                        />
                                                                        <i className="input-icon uil uil-info-circle"></i>
                                                                    </div>
                                                                    <div className="form-group mt-5">
                                                                        <input
                                                                            type="email"
                                                                            name="additionalInfo6"
                                                                            className="form-style"
                                                                            placeholder="Email"
                                                                            id="additionalInfo6"
                                                                            autoComplete="off"
                                                                        />
                                                                        <i className="input-icon uil uil-info-circle"></i>
                                                                    </div>
                                                                </div>
                                                            )}
                                                            <button type="submit" className="btn mt-4">SIGN UP</button>
                                                        </form>
                                                    </div>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Login;
