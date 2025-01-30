import { getWorksAndStore, getStoredWorks } from './api.js';

let currentWorksIndex = 0;

async function fetchAndDisplayWorks() {
    await getWorksAndStore();
    
    const works = getStoredWorks(); 
    const galleryEl = document.querySelector('.gallery');
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

fetchAndDisplayWorks()
/* async function fetchAndDisplayWorks() {
    // waits fot the promise to finish
    await getWorksAndStore(); 
    const works = getStoredWorks();
  
    const galleryEl = document.querySelector('.gallery')
    for (let i = 0; i < works.length; i++) {
        const work = works[i];
    
        // creates figure + retrieves and add work id 
        const figure = document.createElement('figure');
   /*      figure.setAttribute('id',`work-${work.id}`) */
        // creates img + retrieves and add src + alt 
/*         const img = document.createElement('img');
        img.src = "/assets/images";
        img.alt = blalba
        // creates figcaption + retrieves and add title
        const figcaption = document.createElement('figcaption');
        figcaption.textContent = Text;

        figure.appendChild(img);
        figure.appendChild(figcaption)

        galleryEl.appendChild(figure) */
/* /* } */
/* } */ 
/* /* getWorksAndStore();
getStoredWorks(); */
