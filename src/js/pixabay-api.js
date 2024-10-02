import axios from "axios";

const BASE_URL = "https://pixabay.com/api/";
const API_KEY = "46160899-12bbcf382b0949676f8e01c93";

export async function fetchImages({ query, page = 1 }) {
    try {
        const response = await axios.get(`${BASE_URL}`, {
            params: {
                key: API_KEY,
                q: query,
                image_type: 'photo',
                orientation: 'horizontal',
                safesearch: true,
                page,
                per_page: 15
            }
        });

        if (response.data.hits.length === 0) {
            throw new Error("Sorry, there are no images matching your search query. Please try again!");
        }

        return response.data;
    } catch (error) {
        
        if (error.response) {
            
            throw new Error(`Server Error: ${error.response.status} - ${error.response.statusText}`);
        } else if (error.request) {
            throw new Error("Network error occurred. Please check your connection or try again later.");
        } else {
            throw new Error(`Error: ${error.message}`);
        }
    }
}
