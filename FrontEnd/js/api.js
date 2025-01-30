export async function getCategories() {
    const response = await fetch('http://localhost:5678/api/categories')
    const data = await response.json();
    return data;
}

export async function storeCategories() {
    const categoriesEl = await getCategories();
    if (categoriesEl) {
        console.log('categories fetched:',categoriesEl);
    } else {
        console.log('failed to store categories')
    }
}

let worksData = [];
export async function getWorksAndStore() {
    const response = await fetch('http://localhost:5678/api/works')
    const data = await response.json();
    worksData = data;
    return data;
}
export async function getStoredWorks(){
    return worksData;
}




