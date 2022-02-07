import { Group } from '../book/renderPage';
import { getWords } from '../js/api';
import { CardElement } from '../card/cardElement';

export let currentPage = 1;
export const totalPages = 30;

const counter = document.querySelector('.counter');
const prevButton = document.getElementById('prev');
const nextButton = document.getElementById('next');

export async function changeLevel() {
  document.body.addEventListener('click', async (e: MouseEvent) => {
    const cardsOnPage = document.querySelector('.book-page');
    if (e.target) {
      if ((e.target as HTMLElement).classList.contains('level')) {
        const id = +(e.target as HTMLElement).id.split('level')[1];
        if (cardsOnPage) cardsOnPage.innerHTML = '';
        const data = await getWords(id, currentPage);
        data.forEach((element) => {
          const cardOnPage = new CardElement(element).renderCard();
          if (cardsOnPage) cardsOnPage.appendChild(cardOnPage);
        });
        return cardsOnPage;
      }
      return cardsOnPage;
    }
  });
}
export async function prevPage() {
  if (currentPage > 1) {
    currentPage -= 1;
    if (counter) {
      counter.innerHTML = `${currentPage} / ${totalPages}`;
    }
    const cardsOnPage = document.querySelector('.book-page');
    if (cardsOnPage) cardsOnPage.innerHTML = '';
    const data = await getWords(Group, currentPage);
    data.forEach((element) => {
      const cardOnPage = new CardElement(element).renderCard();
      if (cardsOnPage) cardsOnPage.appendChild(cardOnPage);
    });
    return cardsOnPage;
  }
}

export async function nextPage() {
  if (currentPage < totalPages) {
    currentPage += 1;
    if (counter) {
      counter.innerHTML = `${currentPage} / ${totalPages}`;
    }
    const cardsOnPage = document.querySelector('.book-page');
    if (cardsOnPage) cardsOnPage.innerHTML = '';
    const data = await getWords(Group, currentPage);
    data.forEach((element) => {
      const cardOnPage = new CardElement(element).renderCard();
      if (cardsOnPage) cardsOnPage.appendChild(cardOnPage);
    });
    return cardsOnPage;
  }
}

export const checkButtonOpacity = (): void => {
  if (prevButton) {
    if (currentPage === 1) {
      prevButton.classList.add('opacity');
    } else { prevButton.classList.remove('opacity'); }
  }
  if (nextButton) {
    if (currentPage === totalPages) {
      nextButton.classList.add('opacity');
    } else {
      nextButton.classList.remove('opacity');
    }
  }
};