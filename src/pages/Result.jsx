import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

const UserAvatarIcon = () => (
    <svg className="w-8 h-8 text-gray-700" fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
        <path fillRule="evenodd" d="M18 10a6 6 0 11-12 0 6 6 0 0112 0zm-6 8c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" clipRule="evenodd" />
    </svg>
);

export default function Result() {
    const location = useLocation();
    const navigate = useNavigate();

    const [answers, setAnswers] = useState({});

    const generationData = location.state?.generationData;

    useEffect(() => {
        if (!generationData) {
            navigate('/dashboard');
        }
    }, [generationData, navigate]);

    if (!generationData) return null;

    const { title, summaryText, keyTakeaways, quiz } = generationData;

    const handlePrint = () => {
        window.print();
    };

    const handleSelectOption = (questionIndex, optionIndex) => {
        if (answers[questionIndex] !== undefined) return;

        setAnswers(prev => ({
            ...prev,
            [questionIndex]: optionIndex
        }));
    };

    const getScore = () => {
        let correctCount = 0;
        quiz.forEach((q, idx) => {
            if (answers[idx] === q.correctAnswer) {
                correctCount++;
            }
        });
        return correctCount;
    };

    const handleReset = () => {
        setAnswers({});
    };

    const getOptionClass = (qIdx, optIdx) => {
        const selectedOpt = answers[qIdx];
        const correctOpt = quiz[qIdx].correctAnswer;

        if (selectedOpt === undefined) {
            return "flex items-center space-x-4 p-4 bg-white rounded-xl border-2 border-transparent cursor-pointer hover:border-[#2E1071] transition-all";
        }

        if (optIdx === correctOpt) {
            return "flex items-center space-x-4 p-4 bg-green-100 rounded-xl border-2 border-green-500 cursor-default";
        }

        if (selectedOpt === optIdx && selectedOpt !== correctOpt) {
            return "flex items-center space-x-4 p-4 bg-red-100 rounded-xl border-2 border-red-500 cursor-default";
        }

        return "flex items-center space-x-4 p-4 bg-gray-50 rounded-xl border-2 border-transparent cursor-default opacity-65";
    };

    const totalAnswered = Object.keys(answers).length;
    const score = getScore();

    useEffect(() => {
        if (totalAnswered === quiz.length && quiz.length > 0) {
            const savedHistory = JSON.parse(localStorage.getItem('quizHistory')) || [];

            const existingIndex = savedHistory.findIndex(item => item.title === title);

            const newHistoryItem = {
                id: Date.now().toString(),
                title: title || "Generated Topic",
                date: new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }),
                summaryText: summaryText,
                keyTakeaways: keyTakeaways,
                quiz: quiz,
                userScore: {
                    correct: score,
                    total: quiz.length
                }
            };

            if (existingIndex !== -1) {
                savedHistory[existingIndex] = newHistoryItem;
            } else {
                savedHistory.unshift(newHistoryItem);
            }

            localStorage.setItem('quizHistory', JSON.stringify(savedHistory));
        }
    }, [totalAnswered, quiz.length, score, title, summaryText, keyTakeaways, quiz]);

    return (
        <div className="flex flex-col min-h-screen font-sans antialiased text-gray-900 bg-white select-none relative print:bg-white">

            <header className="flex items-center justify-between px-12 py-5 bg-white border-b border-gray-200 shadow-sm z-10 print:hidden">
                <div className="text-3xl font-bold text-[#2E1071] tracking-tight font-serif">NoteQuiz</div>
                <h1 className="text-3xl font-extrabold text-[#2E1071] tracking-wide text-center flex-1 max-w-4xl mx-auto">LECTURE RESULTS</h1>
                <div
                    onClick={() => navigate('/profile')}
                    className="flex items-center text-gray-800 cursor-pointer hover:opacity-80 transition-opacity">
                    <UserAvatarIcon />
                </div>
            </header>

            <main className="flex-1 flex w-full items-stretch print:block">

                <div className="w-1/2 bg-white pl-24 pr-16 py-12 flex flex-col print:w-full print:p-0 print:m-0">
                    <div className="flex justify-between items-center mb-8 print:hidden">
                        <h2 className="text-3xl font-bold text-[#2E1071]">AI Summary</h2>
                        <button
                            onClick={handlePrint}
                            className="bg-[#EDF0F8] text-[#2E1071] font-bold py-2.5 px-8 rounded-full hover:bg-indigo-100 transition-colors shadow-sm"
                        >
                            Export PDF
                        </button>
                    </div>

                    <div className="print:block">
                        <h1 className="text-4xl font-extrabold text-gray-900 mb-6 hidden print:block text-center border-b pb-4">Lecture Summary</h1>

                        <h3 className="text-2xl font-bold text-gray-800 mb-4 print:mt-4">{title || "Generated Topic"}</h3>
                        <p className="text-[17px] leading-relaxed text-gray-700 font-normal mb-8">
                            {summaryText}
                        </p>

                        <h4 className="text-xl font-bold text-gray-800 mb-4">Key Takeaways:</h4>
                        <ul className="list-disc pl-6 space-y-3 text-[17px] text-gray-700">
                            {keyTakeaways?.map((point, i) => (
                                <li key={i}>{point}</li>
                            ))}
                        </ul>
                    </div>
                </div>

                <div className="w-1/2 bg-[#2E1071] py-12 pl-16 pr-24 flex flex-col justify-start items-center print:hidden">
                    <div className="flex justify-between items-center mb-8 w-full max-w-xl">
                        <h2 className="text-3xl font-bold text-white">Knowledge Quiz</h2>
                        {totalAnswered === quiz.length && (
                            <button
                                onClick={handleReset}
                                className="text-sm font-semibold text-indigo-200 hover:text-white transition-colors"
                            >
                                Try Again
                            </button>
                        )}
                    </div>

                    <div className="space-y-8 w-full max-w-xl">
                        {quiz?.map((q, qIdx) => (
                            <div key={qIdx} className="bg-[#EDF0F8] rounded-2xl p-6 shadow-lg">
                                <h3 className="text-xl font-bold text-[#2E1071] mb-4">
                                    {qIdx + 1}. {q.question}
                                </h3>

                                <div className="space-y-3">
                                    {q.options.map((option, optIdx) => (
                                        <div
                                            key={optIdx}
                                            onClick={() => handleSelectOption(qIdx, optIdx)}
                                            className={getOptionClass(qIdx, optIdx)}
                                        >
                                            <span className="text-lg font-medium text-gray-800">
                                                {option}
                                            </span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        ))}

                        {totalAnswered === quiz.length && quiz.length > 0 && (
                            <div className="bg-white/10 rounded-2xl p-6 text-center border-2 border-white/20">
                                <h3 className="text-2xl font-extrabold text-white mb-2">Quiz Completed!</h3>
                                <p className="text-xl font-medium text-indigo-100">
                                    Your Score: <span className="text-green-400 font-black">{score}</span> / {quiz.length} ({Math.round((score / quiz.length) * 100)}%)
                                </p>
                            </div>
                        )}
                    </div>
                </div>
            </main>
        </div>
    );
}