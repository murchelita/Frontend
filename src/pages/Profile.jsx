import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const BackIcon = () => (
    <svg className="w-6 h-6 text-[#2E1071]" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
    </svg>
);

const DocumentIcon = () => (
    <svg className="w-8 h-8 text-[#2E1071]" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
    </svg>
);

export default function Profile() {
    const navigate = useNavigate();

    const [userData, setUserData] = useState({ name: 'User', email: '' });
    const [history, setHistory] = useState([]);

    useEffect(() => {
        const savedName = localStorage.getItem('username') || 'Unknown User';
        const savedEmail = localStorage.getItem('email') || 'No email provided';
        setUserData({ name: savedName, email: savedEmail });

        const savedHistory = JSON.parse(localStorage.getItem('quizHistory')) || [];
        setHistory(savedHistory);
    }, []);

    const handleViewDetails = (item) => {
        navigate('/result', { state: { generationData: item } });
    };

    const handleBack = () => {
        navigate('/dashboard');
    };

    const getScorePercentage = (score) => {
        if (!score) return null;
        return Math.round((score.correct / score.total) * 100);
    };

    const getScoreColorClass = (percentage) => {
        if (percentage >= 80) return "text-green-600 bg-green-50 border-green-200";
        if (percentage >= 50) return "text-yellow-600 bg-yellow-50 border-yellow-200";
        return "text-red-600 bg-red-50 border-red-200";
    };

    return (
        <div className="flex flex-col min-h-screen font-sans antialiased text-gray-900 bg-white select-none">
            <header className="flex items-center justify-between px-12 py-5 bg-white border-b border-gray-200 shadow-sm z-10">
                <button
                    onClick={handleBack}
                    className="flex items-center justify-center p-2 rounded-full hover:bg-gray-100 transition-colors"
                >
                    <BackIcon />
                </button>
                <h1 className="text-3xl font-extrabold text-[#2E1071] tracking-wide text-center flex-1 max-w-4xl mx-auto">MY PROFILE & HISTORY</h1>
                <div className="w-10 h-10" />
            </header>

            <main className="flex-1 max-w-5xl w-full mx-auto px-12 py-12">
                <div className="flex items-center space-x-6 mb-12 pb-8 border-b border-gray-100">
                    <div className="w-20 h-20 bg-[#EDF0F8] rounded-full flex items-center justify-center border-2 border-[#2E1071]">
                        <span className="text-3xl font-black text-[#2E1071] uppercase">
                            {userData.name.charAt(0)}
                        </span>
                    </div>
                    <div>
                        <h2 className="text-3xl font-bold text-[#2E1071]">{userData.name}</h2>
                        <p className="text-gray-500 font-medium">{userData.email}</p>
                    </div>
                </div>

                <div className="flex justify-between items-center mb-8">
                    <h3 className="text-2xl font-bold text-[#2E1071]">Your Generated Lectures</h3>
                    <span className="text-sm font-semibold text-gray-500 px-3 py-1 bg-gray-100 rounded-full">
                        {history.length} Sessions
                    </span>
                </div>

                <div className="space-y-6">
                    {history.length === 0 ? (
                        <div className="text-center py-12 bg-gray-50 rounded-2xl border-2 border-dashed border-gray-200">
                            <p className="text-gray-500 font-medium">No history yet. Generate your first summary!</p>
                        </div>
                    ) : (
                        history.map((item) => {
                            const scorePercentage = getScorePercentage(item.userScore);
                            return (
                                <div
                                    key={item.id}
                                    onClick={() => handleViewDetails(item)}
                                    className="flex items-center justify-between p-6 bg-[#EDF0F8] rounded-2xl border-2 border-transparent hover:border-[#2E1071] cursor-pointer transition-all shadow-sm"
                                >
                                    <div className="flex items-center space-x-6 flex-1 min-w-0">
                                        <div className="p-3 bg-white rounded-xl shadow-sm">
                                            <DocumentIcon />
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <span className="text-xs font-semibold text-indigo-600 uppercase tracking-wider">{item.date}</span>
                                            <h4 className="text-xl font-bold text-gray-900 truncate mt-1">{item.title}</h4>
                                            <p className="text-gray-600 text-sm mt-1 truncate max-w-2xl">{item.summaryText}</p>
                                        </div>
                                    </div>

                                    <div className="flex items-center space-x-6 ml-6">
                                        {scorePercentage !== null ? (
                                            <div className={`flex flex-col items-center px-4 py-2 rounded-xl border text-center min-w-[100px] ${getScoreColorClass(scorePercentage)}`}>
                                                <span className="text-xs font-bold uppercase tracking-wider">Quiz Score</span>
                                                <span className="text-lg font-black">{scorePercentage}%</span>
                                                <span className="text-[10px] font-semibold opacity-80">{item.userScore.correct}/{item.userScore.total} Qs</span>
                                            </div>
                                        ) : (
                                            <div className="flex flex-col items-center px-4 py-2 rounded-xl border border-gray-200 bg-gray-50 text-gray-400 text-center min-w-[100px]">
                                                <span className="text-xs font-bold uppercase tracking-wider">Quiz</span>
                                                <span className="text-lg font-black">-</span>
                                                <span className="text-[10px] font-semibold opacity-80">Not Taken</span>
                                            </div>
                                        )}
                                        <svg className="w-6 h-6 text-[#2E1071]" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M9 5l7 7-7 7" />
                                        </svg>
                                    </div>
                                </div>
                            );
                        })
                    )}
                </div>
            </main>
        </div>
    );
}