
export async function getCategoriesAndReturn() {
    const response = await fetch('http://localhost:5678/api/categories')
    const data = await response.json();
    return data;
}



export async function getWorksAndReturn() {
    const response = await fetch('http://localhost:5678/api/works')
    const data = await response.json();
    return data;
}




