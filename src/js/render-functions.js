import iziToast from "izitoast";
import "izitoast/dist/css/iziToast.min.css";



export function clearGallery(galleryElement) {
  galleryElement.innerHTML = '';
}

export function renderGallery(images, galleryElement) {
  const markup = images.map(({ webformatURL, largeImageURL, tags, likes, views, comments, downloads }) => {
    return `
    <li class ="gallery-item">
      <a href="${largeImageURL}" class="gallery-link">
        <img src="${webformatURL}" alt="${tags}" class="gallery-image" loading="lazy" />
        <div class="info">
          <p class="info-item"><b>Likes:</b> ${likes}</p>
          <p class="info-item"><b>Views:</b> ${views}</p>
          <p class="info-item"><b>Comments:</b> ${comments}</p>
          <p class="info-item"><b>Downloads:</b> ${downloads}</p>
        </div>
      </a>
      </li>`;
  }).join("");
  
  galleryElement.insertAdjacentHTML("beforeend", markup);
}