import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

export default function Register() {
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');

    // Ініціалізуємо хук навігації
    const navigate = useNavigate();

    const handleRegister = (e) => {
        e.preventDefault();
        console.log({ username, email, password, confirmPassword });
        navigate('/dashboard');
    };

    return (
        <div className="flex h-screen w-full font-sans">

            {/* Ліва частина (Фіолетова) */}
            <div className="w-1/2 bg-[#3f1d9b] flex flex-col justify-center items-center p-12 text-center">
                <svg
                    viewBox="0 0 72 48"
                    className="h-28 text-white mb-6"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                >
                    <path d="M2 10h12a8 8 0 0 1 8 8v22a6 6 0 0 0-6-6H2z" />
                    <path d="M42 10H30a8 8 0 0 0-8 8v22a6 6 0 0 1 6-6h12z" />
                    <rect x="52" y="12" width="8" height="14" rx="4" />
                    <path d="M46 22v2a10 10 0 0 0 20 0v-2" />
                    <line x1="56" y1="34" x2="56" y2="42" />
                    <line x1="50" y1="42" x2="62" y2="42" />
                </svg>

                <h1 className="text-5xl font-bold text-white mb-4">NoteQuiz</h1>
                <p className="text-white text-lg max-w-md">
                    Information system for creating intelligent summaries and tests based on audio and video lectures
                </p>
            </div>

            {/* Права частина (Біла) */}
            <div className="w-1/2 bg-white flex flex-col justify-center items-center p-12">
                <div className="w-full max-w-sm">
                    <h2 className="text-3xl font-bold text-gray-800 text-center mb-8">Register</h2>

                    <form className="space-y-4" onSubmit={handleRegister}>
                        <div>
                            <label className="block text-gray-700 font-medium mb-1">Username</label>
                            <input
                                type="text"
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                                className="w-full bg-gray-100 border border-transparent rounded-lg p-3 outline-none focus:border-[#3f1d9b] text-gray-900 transition-colors"
                                placeholder="Enter your username"
                                required
                            />
                        </div>

                        <div>
                            <label className="block text-gray-700 font-medium mb-1">Email</label>
                            <input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="w-full bg-gray-100 border border-transparent rounded-lg p-3 outline-none focus:border-[#3f1d9b] text-gray-900 transition-colors"
                                placeholder="Enter your email"
                                required
                            />
                        </div>

                        <div>
                            <label className="block text-gray-700 font-medium mb-1">Password</label>
                            <input
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="w-full bg-gray-100 border border-transparent rounded-lg p-3 outline-none focus:border-[#3f1d9b] text-gray-900 transition-colors"
                                placeholder="••••••••"
                                required
                            />
                        </div>

                        <div>
                            <label className="block text-gray-700 font-medium mb-1">Repeat password</label>
                            <input
                                type="password"
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                className="w-full bg-gray-100 border border-transparent rounded-lg p-3 outline-none focus:border-[#3f1d9b] text-gray-900 transition-colors"
                                placeholder="••••••••"
                                required
                            />
                        </div>

                        <button
                            type="submit"
                            className="w-full bg-[#3f1d9b] hover:bg-[#2c1270] text-white font-medium rounded-lg py-3 mt-4 transition-colors"
                        >
                            Sign up
                        </button>
                    </form>

                    <div className="text-center mt-6">
                        <span className="text-gray-500">Already have an account? </span>
                        <Link to="/login" className="text-[#3f1d9b] font-medium hover:underline">
                            Login
                        </Link>
                    </div>
                </div>
            </div>

        </div>
    );
}