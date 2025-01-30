import { getWorksAndReturn, getStoredWorks, getCategoriesAndReturn, getStoredCategories} from './api.js';



async function fetchAndDisplayWorks() {
    await getWorksAndReturn();
    
    const works = await getStoredWorks(); 
    const galleryEl = document.querySelector('.gallery');
    galleryEl.innerHTML = '';
    
    // const filteredWorks = works
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

// async function updateByCategories() {
//     const categories = await getCategoriesAndReturn();
//     const storedCategories = await getStoredCategories();

//     if (JSON.stringify(storedCategories) !== JSON.stringify(categories){
//         currentCategories = categories; 
//         await fetchAndDisplayWorks();
//     }
// }

// async function linkFiltersToCategories() {
//     await getCategoriesAndReturn();

//     const categories = await getStoredCategories();
//     let allWorks = document.getElementById("buttonAll")
//     allWorks.addEventListener("click", function()
// {})
// }
fetchAndDisplayWorks()
