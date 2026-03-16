// src/utils/api.js

/**
 * Helper function to send data to the PHP backend.
 * @param {string} endpoint - The PHP file endpoint (e.g., 'api_client_forms.php')
 * @param {Object} data - The JSON object to send
 * @returns {Promise<Object>} The JSON response from the server
 */
export const postToApi = async (endpoint, data) => {
    // Determine the base URL dynamically
    // In local development (React runs on 3000), point to XAMPP (usually port 80 or 8080)
    // In production, the backend folder is at the same origin
    const isLocalhost = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1';
    
    // Adjust this if your local XAMPP runs on a different port than 80
    const baseUrl = isLocalhost ? 'http://localhost/mk-chess-academy/backend/' : '/backend/';
    
    const url = `${baseUrl}${endpoint}`;

    try {
        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data),
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || 'Network response was not ok');
        }

        return await response.json();
    } catch (error) {
        console.error('Error posting to API:', error);
        throw error;
    }
};
