import { getWorksAndReturn, getCategoriesAndReturn} from './api.js';

const galleryEl = document.querySelector('.gallery');
const filtersEl=document.querySelector('.filters');
const showAllEl=document.getElementById('showAll');
const connectEl=document.getElementById('connect');
let currentCategoryId = null;

function ifCurrent() {
document.querySelectorAll('a').forEach(link => {
    if (link.href === window.location.href) {
        link.classList.add('current');
    }
})
}

async function filterWorksByCategory(categoryId) {
    const works = await getWorksAndReturn();
    const filteredWorks = works.filter(work => work.category.id === categoryId); 
    fetchAndDisplayWorks(filteredWorks);
}


async function fetchAndDisplayWorks(filteredWorks) {
    galleryEl.innerHTML = '';

    for ( const work of filteredWorks) {
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


async function fetchAndDisplayCategories() {
    const categories = await getCategoriesAndReturn();

    for (const category of categories) {
        const button = document.createElement('button');
        button.setAttribute('id',`category-${category.id}`)
        button.setAttribute('type','button');
        button.textContent = category.name
        
        button.addEventListener('click', () => {
       if (category.id !== currentCategoryId){
        currentCategoryId = `${category.id}`;
        filterWorksByCategory(category.id)
       }
        })
        filtersEl.appendChild(button);
    }
        if (showAllEl) {
            showAllEl.addEventListener('click', async () => {
                const allWorks = await getWorksAndReturn();
                fetchAndDisplayWorks(allWorks);
                
            })
        }
}

async function submitLogIn() {
    connectEl.addEventListener('submit', event => {
event.preventDefault();
const formData = new FormData(formEl);
const data = Object.fromEntries(formData.entries())

fetch('http://localhost:5678/api/users/login', {
    method: 'POST',
    headers: {
        'Content-Type': 'application/json'
    },
    body: JSON.stringify(data)
})
.then(json => {
    if (json.status === 'success') {
        window.location.href = '/index';
    } else {
        console.error('login failed');
    }

});
});
};

async function init() {
    ifCurrent();
const allWorks = await getWorksAndReturn();
    fetchAndDisplayWorks(allWorks);
await fetchAndDisplayCategories();
submitLogIn();

}

init();