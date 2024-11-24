import React, { useState } from 'react';
import axios from 'axios';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser, faEnvelope, faLock, faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons';

const SignUp = () => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [photo, setPhoto] = useState(null);
    const [passwordVisible, setPasswordVisible] = useState(false);
    const [confirmPasswordVisible, setConfirmPasswordVisible] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    // Toggle password visibility
    const togglePasswordVisibility = () => {
        setPasswordVisible(!passwordVisible);
    };

    const toggleConfirmPasswordVisibility = () => {
        setConfirmPasswordVisible(!confirmPasswordVisible);
    };

    // Handle file input for photo upload
    const handlePhotoChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setPhoto(URL.createObjectURL(file));  // Image preview
        }
    };

    // Handle form submission and send data to the backend
    const signUpUser = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        if (password !== confirmPassword) {
            setError('Passwords do not match.');
            setLoading(false);
            return;
        }

        try {
            const formData = new FormData();
            formData.append('name', name);
            formData.append('email', email);
            formData.append('password', password);
            formData.append('photo', e.target.photo.files[0]);  // Append the photo file

            const response = await axios.post('https://your-backend-url.com/api/signup', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });

            console.log(response.data);
            alert('Signup successful!');
        } catch (err) {
            console.error('Signup failed', err);
            setError('Signup failed. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="bg-black text-white flex min-h-screen flex-col items-center pt-16 sm:justify-center sm:pt-0">
            <a href="#">
                <div className="text-foreground font-semibold text-2xl tracking-tighter mx-auto flex items-center gap-2">
                    <div>
                        <img src="/chat.png" alt="CHATWAVE Logo" className="w-12 h-12 rounded-full" />
                    </div>
                    <div className="text-2xl">CHATWAVE</div>
                </div>
            </a>

            <div className="relative mt-12 w-full max-w-lg sm:mt-10">
                <div className="relative -mb-px h-px w-full bg-gradient-to-r from-transparent via-sky-300 to-transparent"></div>
                <div className="mx-5 border dark:border-b-white/50 dark:border-t-white/50 border-b-white/20 sm:border-t-white/20 shadow-[20px_0_20px_20px] shadow-slate-500/10 dark:shadow-white/20 rounded-lg border-white/20 border-l-white/20 border-r-white/20 sm:shadow-sm lg:rounded-xl lg:shadow-none">
                    <div className="flex flex-col p-6">
                        <h3 className="text-xl font-semibold leading-6 tracking-tighter">Sign Up</h3>
                        <p className="mt-1.5 text-sm font-medium text-white/50">Create your account to get started.</p>
                    </div>

                    {/* Image Preview Section */}
                    <div className="flex justify-center mt-4">
                        <label htmlFor="photo" className="cursor-pointer">
                            <div className="relative w-32 h-32 rounded-full border-2 border-sky-300 overflow-hidden">
                                {photo ? (
                                    <img src={photo} alt="Profile Preview" className="w-full h-full object-cover" />
                                ) : (
                                    <div className="flex items-center justify-center w-full h-full text-sky-300">
                                        <FontAwesomeIcon icon={faUser} size="2x" />
                                    </div>
                                )}
                            </div>
                            <input
                                type="file"
                                id="photo"
                                name="photo"
                                className="hidden"
                                accept="image/*"
                                onChange={handlePhotoChange}
                            />
                        </label>
                    </div>

                    <div className="p-6 pt-0">
                        <form onSubmit={signUpUser}>
                            {/* Name */}
                            <div className="mt-4">
                                <label className="text-xs font-medium text-muted-foreground">Full Name</label>
                                <div className="flex items-center rounded-lg border focus-within:border-sky-200 px-3 pb-1.5 pt-2.5 duration-200 focus-within:ring focus-within:ring-sky-300/30">
                                    <FontAwesomeIcon icon={faUser} className="text-sky-300" />
                                    <input
                                        type="text"
                                        name="name"
                                        value={name}
                                        onChange={(e) => setName(e.target.value)}
                                        placeholder="Full Name"
                                        className="block w-full border-0 bg-transparent pl-3 text-sm file:my-1 placeholder:text-muted-foreground/90 focus:outline-none focus:ring-0 sm:leading-7 text-foreground"
                                    />
                                </div>
                            </div>

                            {/* Email */}
                            <div className="mt-4">
                                <label className="text-xs font-medium text-muted-foreground">Email</label>
                                <div className="flex items-center rounded-lg border focus-within:border-sky-200 px-3 pb-1.5 pt-2.5 duration-200 focus-within:ring focus-within:ring-sky-300/30">
                                    <FontAwesomeIcon icon={faEnvelope} className="text-sky-300" />
                                    <input
                                        type="email"
                                        name="email"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        placeholder="Email"
                                        className="block w-full border-0 bg-transparent pl-2 text-sm file:my-1 placeholder:text-muted-foreground/90 focus:outline-none focus:ring-0 sm:leading-7 text-foreground"
                                    />
                                </div>
                            </div>

                            {/* Password */}
                            <div className="mt-4">
                                <label className="text-xs font-medium text-muted-foreground">Password</label>
                                <div className="flex items-center rounded-lg border focus-within:border-sky-200 px-3 pb-1.5 pt-2.5 duration-200 focus-within:ring focus-within:ring-sky-300/30">
                                    <input
                                        type={passwordVisible ? "text" : "password"}
                                        name="password"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        placeholder="Password"
                                        className="block w-full border-0 bg-transparent p-0 text-sm file:my-1 placeholder:text-muted-foreground/90 focus:outline-none focus:ring-0 focus:ring-teal-500 sm:leading-7 text-foreground"
                                    />
                                    <button
                                        type="button"
                                        onClick={togglePasswordVisibility}
                                    >
                                        <FontAwesomeIcon icon={passwordVisible ? faEyeSlash : faEye} className="w-6 h-6 text-gray-400" />
                                    </button>
                                </div>
                            </div>

                            {/* Confirm Password */}
                            <div className="mt-4">
                                <label className="text-xs font-medium text-muted-foreground">Confirm Password</label>
                                <div className="flex items-center rounded-lg border focus-within:border-sky-200 px-3 pb-1.5 pt-2.5 duration-200 focus-within:ring focus-within:ring-sky-300/30">
                                    <input
                                        type={confirmPasswordVisible ? "text" : "password"}
                                        name="confirmPassword"
                                        value={confirmPassword}
                                        onChange={(e) => setConfirmPassword(e.target.value)}
                                        placeholder="Confirm Password"
                                        className="block w-full border-0 bg-transparent p-0 text-sm file:my-1 placeholder:text-muted-foreground/90 focus:outline-none focus:ring-0 focus:ring-teal-500 sm:leading-7 text-foreground"
                                    />
                                    <button
                                        type="button"
                                        onClick={toggleConfirmPasswordVisibility}
                                    >
                                        <FontAwesomeIcon icon={confirmPasswordVisible ? faEyeSlash : faEye} className="w-6 h-6 text-gray-400" />
                                    </button>
                                </div>
                            </div>

                            {error && <p className="mt-4 text-red-500">{error}</p>}

                            <div className="mt-4 flex items-center justify-end gap-x-2">
                                <button
                                    className="font-semibold bg-blue-500 hover:bg-blue-700 text-white text-sm rounded-md px-4 py-2"
                                    type="submit"
                                    disabled={loading}
                                >
                                    {loading ? "Signing Up..." : "Sign Up"}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SignUp;
