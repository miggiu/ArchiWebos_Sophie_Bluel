const logoutEl = document.getElementById('logout');

let loggedIn  = false
     export async function ifLoggedIn() {

        if (loggedIn) return;
        const token = localStorage.getItem('user_token');
        if (token) {
            console.log('found token:', token);
            logoutEl.textContent='logout';
            document.getElementById("showAll").className = "not-displayed";
            document.getElementById("category-1").className = "not-displayed";
            document.getElementById("category-2").className = "not-displayed";
            document.getElementById("category-3").className = "not-displayed";
            loggedIn = true;
        } else { 
            console.log('no token found');
            loggedIn = false;
        }
    }

    export function logOut() {
        logoutEl.addEventListener('click', () => {
            localStorage.removeItem('user_token');
            console.log('logged out ok:', localStorage)
            
            loggedIn = false;  
             window.location.href = '/FrontEnd/index.html'
             
          
        })
    }