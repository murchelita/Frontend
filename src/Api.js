import axios from 'axios';

const api = axios.create({
    baseURL: 'https://chatty-drivable-unsliced.ngrok-free.dev',
});

export const sendGenerationRequest = async (inputType, fileData, youtubeUrl, userToken) => {
    try {
        let response;
        if (inputType === 'file' || inputType === 'record') {
            const formData = new FormData();
            formData.append('media_file', fileData);

            response = await api.post('/api/generate/file', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                    'Authorization': `Bearer ${userToken}`,
                    'ngrok-skip-browser-warning': 'true'
                }
            });
        } else if (inputType === 'youtube') {
            const payload = { "youtube_url": youtubeUrl };

            response = await api.post('/api/generate/link', payload, {
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
