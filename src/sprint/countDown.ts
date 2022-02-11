import { renderSprintResults, replay } from "./sprintGame";

export function countdown() {
  let seconds = 15;
  function tick() {
    const counter = document.getElementById("counter");
    seconds--;
    (<HTMLElement>counter).innerHTML = "0:" + (seconds < 10 ? "0" : "") + String(seconds);
    if( seconds > 0 ) {
      setTimeout(tick, 1000);
    } else {
      alert("Время истекло");
      // replay();
    }
  }
  tick();
}