// import { toggleSubscribeForm } from "./js/menus.js";



var subscribeLink = document.getElementById("subscribe-link")
subscribeLink.onclick = (event) => {
  var form = document.getElementById("subscribe-form")
  toggleElement(form);
  event.preventDefault();
}

var closeSubscribeForm = document.getElementById("close-subscribe-form")
closeSubscribeForm.onclick = (event) => {
  var form = document.getElementById("subscribe-form")
  toggleElement(form);
  event.preventDefault();
}


const toggleElement = function (el) {
  if (el.classList.contains("hide")) {
    el.classList.replace("hide", "show")
  } else {
    el.classList.replace("show", "hide")
  }
}
// subscribeLink.onclick = toggleSubscribeForm(event)

