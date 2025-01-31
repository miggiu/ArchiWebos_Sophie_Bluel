import { getWorksAndReturn, getStoredWorks, getCategoriesAndReturn, getStoredCategories} from './api.js';



async function fetchAndDisplayWorks() {
    await getWorksAndReturn();
    
    const works = await getStoredWorks(); 
    const galleryEl = document.querySelector('.gallery');
    galleryEl.innerHTML = '';
    
    for ( const work of works) {
    const figure = document.createElement('figure');
    figure.setAttribute('id',`work-${work.id}`);
    const img = document.createElement('img');
    img.src = work.imageUrl
    img.alt = work.title
    const figcaption = document.createElement('figcaption');
    figcaption.textContent = work.title

    figure.appendChild(img);
    figure.appendChild(figcaption);
    galleryEl.appendChild(figure);
}
}

async function filterWorksByCategory(categoryId) {
    const works = await getStoredWorks();

    const filteredWorks = works.filter(work => work.category.id === categoryId); 
    fetchAndDisplayWorks(filteredWorks);
}


async function linkFiltersToCategories() {
    await getCategoriesAndReturn();
    const categories = await getStoredCategories();

    const allWorks = document.getElementById("buttonAll");
    allWorks.addEventListener("click", () => filterWorksByCategory('all'));
    categories.forEach(category => {
        const filterButton = document.getElementById(`${category.id}`);
        filterButton.addEventListener("click", () => filterWorksByCategory(category.id))
    } )
    // const onlyObjects = document.getElementById("buttonObjects");
    // const onlyAppartments = document.getElementById("buttonAppartements");
    // const onlyHotels = document.getElementById("buttonHotels");

    // onlyObjects.addEventListener("click", () => filterWorksByCategory(1));
    // onlyAppartments.addEventListener("click", () => filterWorksByCategory(2));
    // onlyHotels.addEventListener("click", () => filterWorksByCategory(3));
    
}

async function init() {
await getWorksAndReturn();
await fetchAndDisplayWorks();
linkFiltersToCategories();
}

init();