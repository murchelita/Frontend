import axios from 'axios';

const api = axios.create({
    baseURL: import.meta.env.VITE_API_URL || 'https://backend-swv2.onrender.com',
});

export const sendGenerationRequest = async (inputType, fileData, youtubeUrl, userToken) => {
    try {
        let response;
        if (inputType === 'file' || inputType === 'record') {
            const formData = new FormData();
            formData.append('file', fileData);

            response = await api.post('/api/process-media', formData, {
                headers: {
                    'Authorization': `Bearer ${userToken}`,
                    'ngrok-skip-browser-warning': 'true'
                }
            });
        } else if (inputType === 'youtube') {
            const payload = { "url": youtubeUrl };
            response = await api.post('/api/process-youtube', payload, {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${userToken}`,
                    'ngrok-skip-browser-warning': 'true'
                }
            });
        }
        return response.data;
    } catch (error) {
        const errorMessage = error.response?.data?.message || "Unknown error";
        throw new Error(errorMessage);
    }
};