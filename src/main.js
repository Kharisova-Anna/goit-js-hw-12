import { fetchImages } from "./js/pixabay-api.js";
import { renderGallery, clearGallery } from "./js/render-functions.js";
import SimpleLightbox from "simplelightbox";
import "simplelightbox/dist/simple-lightbox.min.css";
import iziToast from "izitoast";
import "izitoast/dist/css/iziToast.min.css";

const searchForm = document.querySelector(".search-form");
const galleryElement = document.querySelector(".gallery");
const loadMoreButton = document.querySelector(".load-more"); 
const loader = document.querySelector(".loader"); 
const lightbox = new SimpleLightbox(".gallery a", {
    captionsData: 'alt',
    captionDelay: 250,
});

let searchQuery = '';
let currentPage = 1; 
const perPage = 15; 
let totalHits = 0;

function showError(message) {
    iziToast.error({
        title: "Error",
        message,
    });
}

function showInfo(message) {
    iziToast.info({
        title: "Info",
        message,
    });
}

searchForm.addEventListener("submit", async (event) => {
    event.preventDefault();
    searchQuery = event.target.elements.searchQuery.value.trim(); 
    
    if (!searchQuery) {
        showError("Please enter a search term.");
        return;
    }

    currentPage = 1; 
    clearGallery(galleryElement); 
    loadMoreButton.style.display = "none"; 
    totalHits = 0; 

    try {
        loader.style.display = "block";
        const data = await fetchImages({ query: searchQuery, page: currentPage });

        totalHits = data.totalHits; 

        if (data.hits.length === 0) {
            showError("Sorry, there are no images matching your search query. Please try again!");
        } else {
            renderGallery(data.hits, galleryElement); 
            lightbox.refresh(); 
            loadMoreButton.style.display = totalHits > perPage ? "block" : "none";
        }
    } catch (error) {
        showError(error.message);
    } finally {
        loader.style.display = "none";
    }
});

loadMoreButton.addEventListener("click", async () => {
    currentPage += 1;

    try {
        loader.style.display = "block";
        const data = await fetchImages({ query: searchQuery, page: currentPage });

        if (data.hits.length > 0) {
            renderGallery(data.hits, galleryElement);
            lightbox.refresh();
            const galleryItem = document.querySelector(".gallery-item");
            if (galleryItem) {
                const { height } = galleryItem.getBoundingClientRect();
                window.scrollBy({
                    top: height * 2,
                    behavior: "smooth"
                });
            }

            const totalPages = Math.ceil(totalHits / perPage); 
            if (currentPage >= totalPages) {
                loadMoreButton.style.display = "none"; 
                showInfo("We're sorry, but you've reached the end of search results.");
            }
        }
    } catch (error) {
        showError(`Error fetching more images: ${error.message}`);
    } finally {
        loader.style.display = "none";
    }
});
