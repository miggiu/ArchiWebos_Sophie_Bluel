let categoriesData = [];
export async function getCategoriesAndReturn() {
    const response = await fetch('http://localhost:5678/api/categories')
    const data = await response.json();
    categoriesData = data
    return data;
}

export async function getStoredCategories() {
 return categoriesData;
}

let worksData = [];
export async function getWorksAndReturn() {
    const response = await fetch('http://localhost:5678/api/works')
    const data = await response.json();
    worksData = data;
    return data;
}
export async function getStoredWorks(){
    return worksData;
}




