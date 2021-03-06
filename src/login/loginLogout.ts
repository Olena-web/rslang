import { getItemFromLocalStorage } from '../js/localStorage';

export function renderUserName() {
  if (getItemFromLocalStorage('email') !== null) {
    const nameField = <HTMLElement>document.querySelector('.user-name');
    (<HTMLElement>nameField).innerHTML = getItemFromLocalStorage('email').split('"').join('');
  }
}

export function logout() {
  const logoutBtn = document.getElementById('signout-link');
  (<HTMLElement>logoutBtn).addEventListener('click', () => {
    if (getItemFromLocalStorage('email') != null) {
      localStorage.clear();
      localStorage.removeItem('id');
      localStorage.removeItem('email');
      localStorage.removeItem('token');
      localStorage.removeItem('refreshToken');
      renderUserName(); 
         
      window.location.hash = '#/login/';
      window.location.reload();   
    }
  });
}
