import { AbstractView } from '../js/views/AbstractView';
import { renderPage, createAside, Group } from './renderPage';
import { currentPage } from './paginationBook';
import { addModal, toggleTranslate, toggleButtons } from './settings';
import { renderDifficultPage } from './difficultPage';
import { setItemToLocalStorage } from '../js/localStorage';

export class Manual extends AbstractView {
  constructor() {
    super();
  }

  async getHtml(): Promise<HTMLElement> {
    const app = <HTMLElement>document.getElementById('app');
    const footer = <HTMLElement>document.querySelector('.footer');
    if (footer.classList.contains('hide')) {
      footer.classList.remove('hide');
    }
    // const aside = createAside();
    // app.appendChild(aside);
    addModal();
    toggleTranslate();
    toggleButtons();
    renderDifficultPage();
    setItemToLocalStorage('currentPage', JSON.stringify(`${Group}-${currentPage}`));
    return renderPage(Group, currentPage);
  }
}
export default Manual;
