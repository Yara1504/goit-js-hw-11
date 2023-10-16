import axios from "axios";
import Notiflix from 'notiflix';

const form = document.querySelector(".search-form");
const gallery = document.querySelector(".gallery");
const loadMore = document.querySelector(".load-more");

const apiKey = "39941282-dea05c707e9b8313607810d27";
let currentPage = 1;

form.addEventListener('submit', searchImage);
loadMore.addEventListener('click', loadMoreImg);

async function searchImage(event) {
   event.preventDefault();

   const searchQuery = form.searchQuery.value;
   currentPage = 1;
   gallery.innerHTML = "";

   try {
      const url = `https://pixabay.com/api/?key=${apiKey}&q=${searchQuery}&image_type=photo&orientation=horizontal&safesearch=true&page=${currentPage}&per_page=40`;
      const res = await axios.get(url);
      const data = res.data.hits;

      if (data.length === 0) {
         Notiflix.Notify.failure("Sorry, there are no images matching your search query. Please try again.");
         loadMore.style.display = "none";
      }
      else {
         data.forEach((image) => {
            const photoCard = createPhotoCard(image);
            gallery.appendChild(photoCard);
         });
         loadMore.style.display = "block";
      }
   } catch (error) {
      console.log(error);
   }
   }

function createPhotoCard(image) {
  const photoCard = document.createElement("div");
  photoCard.className = "photo-card";

  const img = document.createElement("img");
  img.src = image.webformatURL;
  img.alt = image.tags;
  img.loading = "lazy";
  

  const info = document.createElement("div");
  info.className = "info";

  const infoItems = [
    { label: "Likes", value: image.likes },
    { label: "Views", value: image.views },
    { label: "Comments", value: image.comments },
    { label: "Downloads", value: image.downloads },
  ];

  infoItems.forEach((item) => {
    const infoItem = document.createElement("p");
    infoItem.className = "info-item";
    infoItem.innerHTML = `<b>${item.label}:</b> ${item.value}`;
    info.appendChild(infoItem);
  });

  photoCard.appendChild(img);
  photoCard.appendChild(info);

  return photoCard;
}

async function loadMoreImg() {
   currentPage += 1;

   const searchQuery = form.searchQuery.value;
   
   try {
      const url = `https://pixabay.com/api/?key=${apiKey}&q=${searchQuery}&image_type=photo&orientation=horizontal&safesearch=true&page=${currentPage}&per_page=40`;
      const res = await axios.get(url);
      const data = res.data.hits;

      data.forEach((image) => {
         const photoCard = createPhotoCard(image);
         gallery.appendChild(photoCard);
      });

      if (currentPage * 40 >= res.data.totalHits) {
         loadMore.style.display = "none";
         Notiflix.Notify.info("We're sorry, but you've reached the end of search results.");
      } else if (data.length < 40) {
        loadMore.style.display = "none";
      } else {
        loadMore.style.display = "block";
      }
   } catch (error) {
      console.log(error);
   }
}
