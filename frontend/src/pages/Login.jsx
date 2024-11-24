import React, { useState } from 'react';
import axios from 'axios';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser, faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [passwordVisible, setPasswordVisible] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    // Toggle Password visibility
    const togglePasswordVisibility = () => {
        setPasswordVisible(!passwordVisible);
    };

    // Handle form submission and send data to the backend
    const loginUser = async (e) => {
        e.preventDefault();  // Prevent default form submission behavior
        setLoading(true);     // Show loading state
        setError('');         // Clear any previous errors

        try {
            // Prepare the form data
            const formData = new FormData();
            formData.append('email', email);
            formData.append('password', password);

            // Send data to the backend using Axios
            //const response = await axios.post('https://your-backend-url.com/api/login', formData, {
            //    headers: {
            //        'Content-Type': 'multipart/form-data',  // Send data as form data
            //    },
            //});
//
            //console.log(response.data);
            // You can also redirect to another page or save user data in localStorage

        } catch (err) {
            // Handle error (invalid credentials, server errors, etc.)
            console.error('Login failed', err);
            setError('Invalid email or password. Please try again.');
        } finally {
            setLoading(false);  // Hide loading state after completion
        }
    };

    return (
        <div className="bg-black text-white flex min-h-screen flex-col items-center pt-16 sm:justify-center sm:pt-0">
            <a href="#">
                <div className="text-foreground font-semibold text-2xl tracking-tighter mx-auto flex items-center gap-2">
                    <div>
                        <img src="/chat.png" alt="CHATWAVE Logo" className="w-10 h-10" />
                    </div>
                    <div className="text-2xl">CHATWAVE</div>
                </div>
            </a>

            <div className="relative mt-12 w-full max-w-lg sm:mt-10">
                <div className="relative -mb-px h-px w-full bg-gradient-to-r from-transparent via-sky-300 to-transparent"></div>
                <div className="mx-5 border dark:border-b-white/50 dark:border-t-white/50 border-b-white/20 sm:border-t-white/20 shadow-[20px_0_20px_20px] shadow-slate-500/10 dark:shadow-white/20 rounded-lg border-white/20 border-l-white/20 border-r-white/20 sm:shadow-sm lg:rounded-xl lg:shadow-none">
                    <div className="flex flex-col p-6">
                        <h3 className="text-xl font-semibold leading-6 tracking-tighter">Login</h3>
                        <p className="mt-1.5 text-sm font-medium text-white/50">Welcome back, enter your credentials to continue.</p>
                    </div>

                    <div className="p-6 pt-0">
                        <form onSubmit={loginUser}>
                            <div className="mt-4">
                                <div className="group relative rounded-lg border focus-within:border-sky-200 px-3 pb-1.5 pt-2.5 duration-200 focus-within:ring focus-within:ring-sky-300/30">
                                    <div className="flex justify-between">
                                        <label className="text-xs font-medium text-muted-foreground group-focus-within:text-white text-gray-400">Email</label>
                                        <div className="absolute right-3 translate-y-2 text-green-200">
                                            <FontAwesomeIcon icon={faUser} className="w-6 h-6" />
                                        </div>
                                    </div>
                                    <input
                                        type="email"
                                        name="email"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        placeholder="Email"
                                        autocomplete="off"
                                        className="block w-full border-0 bg-transparent p-0 text-sm file:my-1 file:rounded-full file:border-0 file:bg-accent file:px-4 file:py-2 file:font-medium placeholder:text-muted-foreground/90 focus:outline-none focus:ring-0 sm:leading-7 text-foreground"
                                    />
                                </div>
                            </div>

                            <div className="mt-4">
                                <div className="group relative rounded-lg border focus-within:border-sky-200 px-3 pb-1.5 pt-2.5 duration-200 focus-within:ring focus-within:ring-sky-300/30">
                                    <div className="flex justify-between">
                                        <label className="text-xs font-medium text-muted-foreground group-focus-within:text-white text-gray-400">Password</label>
                                    </div>
                                    <div className="flex items-center">
                                        <input
                                            type={passwordVisible ? "text" : "password"}
                                            name="password"
                                            value={password}
                                            onChange={(e) => setPassword(e.target.value)}
                                            className="block w-full border-0 bg-transparent p-0 text-sm file:my-1 placeholder:text-muted-foreground/90 focus:outline-none focus:ring-0 focus:ring-teal-500 sm:leading-7 text-foreground"
                                        />
                                        <button
                                            type="button"
                                            className="absolute right-3 translate-y-2"
                                            onClick={togglePasswordVisibility}
                                        >
                                            <FontAwesomeIcon icon={passwordVisible ? faEyeSlash : faEye} className="w-6 h-6 text-gray-400" />
                                        </button>
                                    </div>
                                </div>
                            </div>

                            <div className="mt-4 flex items-center justify-between">
                                <a className="text-sm font-medium text-foreground underline" href="/forgot-password">Forgot password?</a>
                            </div>

                            {error && (
                                <div className="mt-4 text-red-500 text-sm">{error}</div>
                            )}

                            <div className="mt-4 flex items-center justify-end gap-x-2">
                                <a
                                    className="inline-flex items-center justify-center rounded-md text-sm font-medium transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 hover:bg-accent hover:ring hover:ring-white h-10 px-4 py-2 duration-200"
                                    href="/signup"
                                >
                                    Signup
                                </a>
                                <button
                                    className={`font-semibold hover:bg-black hover:text-white hover:ring hover:ring-white transition duration-300 inline-flex items-center justify-center rounded-md text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-white text-black h-10 px-4 py-2 ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
                                    type="submit"
                                    disabled={loading}
                                >
                                    {loading ? 'Logging in...' : 'Log in'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Login;
