import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { sendGenerationRequest } from '../Api';

const FileIcon = () => (
    <svg className="w-14 h-14 text-[#2E1071] flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
    </svg>
);

const MicrophoneIcon = ({ isRecording }) => (
    <svg className={`w-14 h-14 text-[#2E1071] flex-shrink-0 ${isRecording ? 'animate-pulse text-red-500' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
    </svg>
);

const YoutubeIcon = () => (
    <svg className="w-14 h-14 text-[#2E1071] flex-shrink-0" fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
        <path d="M19.615 3.184c-3.604-.246-11.626-.246-15.23 0-3.897.266-4.356 2.62-4.385 8.816.029 6.185.484 8.549 4.385 8.816 3.604.245 11.626.246 15.23 0 3.897-.266 4.356-2.62 4.385-8.816-.029-6.185-.484-8.549-4.385-8.816zm-10.615 12.816v-8l8 4-8 4z" />
    </svg>
);

const UserAvatarIcon = () => (
    <svg className="w-8 h-8 text-gray-700" fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
        <path fillRule="evenodd" d="M18 10a6 6 0 11-12 0 6 6 0 0112 0zm-6 8c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" clipRule="evenodd" />
    </svg>
);

const ClearIcon = () => (
    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
    </svg>
);

export default function Dashboard() {
    const navigate = useNavigate();

    const [selectedFile, setSelectedFile] = useState(null);
    const [fileError, setFileError] = useState('');
    const fileInputRef = useRef(null);

    const [isRecording, setIsRecording] = useState(false);
    const [audioBlob, setAudioBlob] = useState(null);
    const mediaRecorderRef = useRef(null);
    const audioChunksRef = useRef([]);

    const [youtubeLink, setYoutubeLink] = useState('');

    const [isLoading, setIsLoading] = useState(false);
    const [recordingTime, setRecordingTime] = useState(0);

    const hasFile = !!selectedFile;
    const hasAudio = isRecording || !!audioBlob;
    const hasLink = youtubeLink.trim().length > 0;

    const disableFile = hasAudio || hasLink;
    const disableAudio = hasFile || hasLink;
    const disableLink = hasFile || hasAudio;

    useEffect(() => {
        let interval = null;

        if (isRecording) {
            interval = setInterval(() => {
                setRecordingTime((prevTime) => {
                    if (prevTime >= 1800) {
                        stopRecording();
                        return prevTime;
                    }
                    return prevTime + 1;
                });
            }, 1000);
        } else {
            clearInterval(interval);
        }

        return () => clearInterval(interval);
    }, [isRecording]);

    const formatTime = (seconds) => {
        const mins = Math.floor(seconds / 60).toString().padStart(2, '0');
        const secs = (seconds % 60).toString().padStart(2, '0');
        return `${mins}:${secs}`;
    };

    const handleBrowseClick = () => {
        if (!disableFile) {
            fileInputRef.current.click();
        }
    };

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (!file) return;

        const MAX_SIZE_BYTES = 25 * 1024 * 1024;

        if (file.size > MAX_SIZE_BYTES) {
            setFileError('File too large. Maximum 25 MB.');
            setSelectedFile(null);
        } else {
            setFileError('');
            setSelectedFile(file);
        }
    };

    const clearFile = (e) => {
        e.stopPropagation();
        setSelectedFile(null);
        setFileError('');
        if (fileInputRef.current) {
            fileInputRef.current.value = '';
        }
    };

    const clearAudio = (e) => {
        e.stopPropagation();
        setAudioBlob(null);
    };

    const clearYoutubeLink = (e) => {
        e.stopPropagation();
        setYoutubeLink('');
    };

    const startRecording = async () => {
        try {
            const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
            const mediaRecorder = new MediaRecorder(stream);
            mediaRecorderRef.current = mediaRecorder;
            audioChunksRef.current = [];

            mediaRecorder.ondataavailable = (event) => {
                if (event.data.size > 0) {
                    audioChunksRef.current.push(event.data);
                }
            };

            mediaRecorder.onstop = () => {
                const blob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
                setAudioBlob(blob);
                stream.getTracks().forEach(track => track.stop());
            };

            setRecordingTime(0);
            mediaRecorder.start();
            setIsRecording(true);
        } catch (err) {
            alert('Microphone access permission is required.');
        }
    };

    const stopRecording = () => {
        if (mediaRecorderRef.current && mediaRecorderRef.current.state !== 'inactive') {
            mediaRecorderRef.current.stop();
            setIsRecording(false);
        }
    };

    const toggleRecording = () => {
        if (isRecording) {
            stopRecording();
        } else {
            setAudioBlob(null);
            startRecording();
        }
    };

    const handleGenerate = async () => {
        let inputType = '';
        let fileData = null;

        if (selectedFile) {
            inputType = 'file';
            fileData = selectedFile;
        } else if (audioBlob) {
            inputType = 'record';
            fileData = new File([audioBlob], "recorded_lecture.webm", { type: "audio/webm" });
        } else if (youtubeLink.trim() !== '') {
            inputType = 'youtube';
        } else {
            return;
        }

        setIsLoading(true);

        try {
            const userToken = localStorage.getItem('token') || '';
            const result = await sendGenerationRequest(inputType, fileData, youtubeLink, userToken);
            navigate('/result', { state: { generationData: result } });
        } catch (error) {
            alert(`Error: ${error.message}`);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="flex flex-col min-h-screen font-sans antialiased text-gray-900 bg-white select-none relative">
            {isLoading && (
                <div className="fixed inset-0 bg-indigo-950/80 backdrop-blur-sm flex flex-col items-center justify-center z-50">
                    <div className="w-20 h-20 border-4 border-t-[#EDF0F8] border-r-indigo-500 border-b-indigo-500 border-l-indigo-500 rounded-full animate-spin"></div>
                    <h2 className="text-white text-2xl font-bold mt-6 tracking-wide animate-pulse">NoteQuiz AI captures your lecture...</h2>
                    <p className="text-indigo-200 text-sm mt-2">This may take a few minutes. Do not close the page.</p>
                </div>
            )}

            <header className="flex items-center justify-between px-12 py-5 bg-white border-b border-gray-200 shadow-sm z-10">
                <div className="text-3xl font-bold text-[#2E1071] tracking-tight font-serif">NoteQuiz</div>
                <h1 className="text-3xl font-extrabold text-[#2E1071] tracking-wide text-center flex-1 max-w-4xl mx-auto">CREATE NEW SUMMARY & TEST</h1>
                <div
                    onClick={() => navigate('/profile')}
                    className="flex items-center text-gray-800 cursor-pointer hover:opacity-80 transition-opacity">
                    <UserAvatarIcon />
                </div>
            </header>

            <main className="flex-1 flex flex-col justify-center py-6 pb-24">
                <div className="flex w-full items-stretch min-h-[200px] my-4">
                    <div className="w-1/2 bg-white pl-24 pr-16 flex flex-col justify-center">
                        <p className="text-[17px] leading-relaxed text-gray-900 font-normal">
                            Upload an audio or video lecture. Supported formats: .mp3, .wav, .mp4, .mov.
                            Recommended file size: up to 200 MB (Hard limit: 25MB). NoteQuiz will create an intelligent summary and test.
                        </p>
                    </div>

                    <div className="w-1/2 bg-[#2E1071] py-6 pl-16 pr-24 flex justify-start items-center">
                        <div className={`bg-[#EDF0F8] rounded-2xl p-5 shadow-lg w-full max-w-xl flex items-center justify-between space-x-6 transition-opacity duration-300 ${disableFile ? 'opacity-50' : 'opacity-100'}`}>
                            <div className="flex items-center space-x-4">
                                <FileIcon />
                                <div>
                                    <h3 className="text-xl font-bold text-[#2E1071]">Upload File</h3>
                                    {fileError ? (
                                        <p className="text-sm text-red-600 font-medium mt-0.5">{fileError}</p>
                                    ) : selectedFile ? (
                                        <div className="flex items-center space-x-2 mt-0.5">
                                            <p className="text-sm text-green-700 font-medium truncate max-w-[180px]" title={selectedFile.name}>
                                                {selectedFile.name}
                                            </p>
                                            <button
                                                onClick={clearFile}
                                                className="text-red-500 hover:text-red-700 p-1 rounded-full hover:bg-red-50 transition-colors"
                                            >
                                                <ClearIcon />
                                            </button>
                                        </div>
                                    ) : (
                                        <p className="text-sm text-gray-600 mt-0.5">Select file from your device</p>
                                    )}
                                </div>
                            </div>

                            <input
                                type="file"
                                ref={fileInputRef}
                                onChange={handleFileChange}
                                className="hidden"
                                accept="audio/*,video/*"
                                disabled={disableFile}
                            />

                            <button
                                onClick={handleBrowseClick}
                                disabled={disableFile}
                                className={`text-white text-base font-semibold px-10 py-2.5 rounded-full transition-colors duration-200 shadow-md flex-shrink-0 ${disableFile ? 'bg-gray-400 cursor-not-allowed' : 'bg-[#2E1071] hover:bg-indigo-950'}`}
                            >
                                Browse
                            </button>
                        </div>
                    </div>
                </div>

                <div className="flex w-full items-stretch min-h-[200px] my-4">
                    <div className="w-1/2 bg-white pl-24 pr-16 flex flex-col justify-center">
                        <p className="text-[17px] leading-relaxed text-gray-900 font-normal">
                            Start recording directly in NoteQuiz. Record your lecture or discussion.
                            The system transcribes and structures the material in real-time.
                        </p>
                    </div>

                    <div className="w-1/2 bg-[#2E1071] py-6 pl-16 pr-24 flex justify-start items-center">
                        <div className={`bg-[#EDF0F8] rounded-2xl p-5 shadow-lg w-full max-w-xl flex items-center justify-between space-x-6 transition-opacity duration-300 ${disableAudio ? 'opacity-50' : 'opacity-100'}`}>
                            <div className="flex items-center space-x-4">
                                <MicrophoneIcon isRecording={isRecording} />
                                <div>
                                    <h3 className="text-xl font-bold text-[#2E1071]">Record Audio</h3>
                                    {isRecording ? (
                                        <div className="flex items-center space-x-2 mt-0.5">
                                            <span className="inline-block w-2 h-2 rounded-full bg-red-600 animate-ping" />
                                            <p className="text-sm text-red-600 font-bold font-mono">
                                                {formatTime(recordingTime)} / 30:00
                                            </p>
                                        </div>
                                    ) : audioBlob ? (
                                        <div className="flex items-center space-x-2 mt-0.5">
                                            <p className="text-sm text-green-700 font-medium">Recording saved!</p>
                                            <button
                                                onClick={clearAudio}
                                                className="text-red-500 hover:text-red-700 p-1 rounded-full hover:bg-red-50 transition-colors"
                                            >
                                                <ClearIcon />
                                            </button>
                                        </div>
                                    ) : (
                                        <p className="text-sm text-gray-600 mt-0.5">Start lecture recording right now</p>
                                    )}
                                </div>
                            </div>
                            <button
                                onClick={toggleRecording}
                                disabled={disableAudio}
                                className={`${disableAudio ? 'bg-gray-400 cursor-not-allowed' : isRecording ? 'bg-red-600 hover:bg-red-700' : 'bg-[#2E1071] hover:bg-indigo-950'} text-white text-base font-semibold w-32 py-2.5 rounded-full transition-colors duration-200 shadow-md flex-shrink-0 flex justify-center`}
                            >
                                {isRecording ? 'Stop' : 'Record'}
                            </button>
                        </div>
                    </div>
                </div>

                <div className="flex w-full items-stretch min-h-[240px] my-4">
                    <div className="w-1/2 bg-white pl-24 pr-16 flex flex-col justify-center">
                        <p className="text-[17px] leading-relaxed text-gray-900 font-normal">
                            Just paste a link to a tutorial video from YouTube. NoteQuiz will analyze the video and audio,
                            highlight key moments, and generate learning materials.
                        </p>
                    </div>

                    <div className="w-1/2 bg-[#2E1071] py-6 pl-16 pr-24 flex justify-start items-center">
                        <div className={`bg-[#EDF0F8] rounded-2xl p-5 shadow-lg w-full max-w-xl flex flex-col justify-between space-y-4 transition-opacity duration-300 ${disableLink ? 'opacity-50' : 'opacity-100'}`}>
                            <div className="flex items-center space-x-4 w-full">
                                <YoutubeIcon />
                                <div className="flex-1">
                                    <h3 className="text-xl font-bold text-[#2E1071]">Insert Link</h3>
                                    <p className="text-sm text-gray-600 mt-0.5">Enter link to YouTube lecture video</p>
                                </div>
                            </div>

                            <div className="flex items-center w-full relative">
                                <input
                                    type="text"
                                    value={youtubeLink}
                                    disabled={disableLink}
                                    onChange={(e) => setYoutubeLink(e.target.value)}
                                    className={`flex-1 px-4 py-2 pr-10 text-sm text-gray-800 bg-white border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#2E1071] focus:border-[#2E1071] outline-none ${disableLink ? 'bg-gray-200 cursor-not-allowed' : ''}`}
                                    placeholder="https://www.youtube.com/watch?v=..."
                                />
                                {youtubeLink && !disableLink && (
                                    <button
                                        onClick={clearYoutubeLink}
                                        className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-red-500 p-1 rounded-full transition-colors"
                                    >
                                        <ClearIcon />
                                    </button>
                                )}
                            </div>
                        </div>
                    </div>
                </div>

                <div className="w-full flex justify-center mt-8">
                    <button
                        onClick={handleGenerate}
                        disabled={isRecording}
                        className={`text-white text-xl font-bold px-16 py-4 rounded-full shadow-xl transform hover:scale-105 transition-all duration-300 tracking-wide ${isRecording ? 'bg-gray-400 cursor-not-allowed' : 'bg-[#2E1071] hover:bg-indigo-950'}`}
                    >
                        Generate Summary & Quiz
                    </button>
                </div>
            </main>
        </div>
    );
}