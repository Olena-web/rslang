import { Home } from './views/Home';
import { Audiocall } from './views/Audiocall';
import { Login } from './views/Login';
import { Error } from './views/Error';
import { Manual } from './views/Manual';
import { Sprint } from './views/Sprint';
import { Statistics } from './views/Statistics';
import { Route } from './types';
import { listenForLogin } from '..';
import { Signup } from './views/Signup';

function clearAllChildNodes(parent: HTMLElement): void {
  while (parent.firstChild) {
    parent.firstChild.remove();
  }
}

function navigation() {
  const app = <HTMLElement>document.getElementById('app');

  const homeComponent = new Home();
  const loginComponent = new Login();
  const signupComponent = new Signup();
  const manualComponent = new Manual();
  const audiocallComponent = new Audiocall();
  const sprintComponent = new Sprint();
  const statisticsComponent = new Statistics();

  const routes = [
    { path: '/', component: homeComponent },
    { path: '/login/', component: loginComponent },
    { path: '/signup/', component: signupComponent },
    { path: '/manual/', component: manualComponent },
    { path: '/audiocall/', component: audiocallComponent },
    { path: '/sprint/', component: sprintComponent },
    { path: '/statistics/', component: statisticsComponent },
  ];

  // find current location by url in the browser

  const parseLocation = () => location.hash.slice(1).toLowerCase() || '/';

  // find component that corresponds to the current location

  const findComponentByPath = (url: string, urls: Route[]) => urls.find((route) => route.path.match(url)) || undefined;

  const router = async () => {
    // find the component based on the current path
    const path = parseLocation();

    const componentFound = <Route>findComponentByPath(path, routes) || {};
    if (componentFound == null) {
      const errorComponent = new Error();
      clearAllChildNodes(app);
      app.appendChild(await errorComponent.getHtml());
    } else {
      // Render the component in the "app" placeholder
      clearAllChildNodes(app);
      app.appendChild(await componentFound.component.getHtml());
    }
  };

  window.addEventListener('hashchange', router);
  window.addEventListener('load', router);
  const events = ['load', 'hashchange'];
  [...events].forEach((event) => {
    window.addEventListener(event, (e) => {
      const hashClicked = location.hash;

      switch (hashClicked) {
        case ('#/'):
          console.log('We are in home view');
          break;
        case ('#/login/'):
          // listenForLogin();
          console.log('We are in login view');
          break;
        case ('#/signup/'):
          // listenForLogin();
          console.log('We are in signup view');
          break;
        case ('#/manual/'):
          // TODO: add functions with manual
          console.log('We are in manual view');
          break;
        case '#/audiocall/':
          // TODO: add functions with manual
          console.log('We are in audiocall view');
          break;
        case '#/sprint/':
          // TODO: add functions with manual
          console.log('We are in sprint view');
          break;
        case ('#/statistics/'):

          // TODO: add functions with manual
          console.log('We are in statistics view');
          break;
      }
    });
  });
}

export { navigation };
