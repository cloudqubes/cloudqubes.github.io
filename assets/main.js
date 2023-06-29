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

// // This assumes that you're using Rouge; if not, update the selector
// const codeBlocks = document.querySelectorAll('.code-header + .highlighter-rouge');
// const copyCodeButtons = document.querySelectorAll('.copy-code-button');

// copyCodeButtons.forEach((copyCodeButton, index) => {
//   const code = codeBlocks[index].innerText;

//   copyCodeButton.addEventListener('click', () => {
//     // Copy the code to the user's clipboard
//     window.navigator.clipboard.writeText(code);

//     // Update the button text visually
//     const { innerText: originalText } = copyCodeButton;
//     copyCodeButton.innerText = 'Copied!';

//     // (Optional) Toggle a class for styling the button
//     copyCodeButton.classList.add('copied');

//     // After 2 seconds, reset the button to its initial UI
//     setTimeout(() => {
//       copyCodeButton.innerText = originalText;
//       copyCodeButton.classList.remove('copied');
//     }, 2000);
//   });
// });



var codeBlocks = document.querySelectorAll('pre.highlight');

codeBlocks.forEach(function (codeBlock) {
  var  Button = document.createElement('button');
   Button.className = 'copy';
   Button.type = 'button';
   Button.ariaLabel = 'Copy code to clipboard';
   Button.innerText = 'Copy';

  codeBlock.append( Button);

   Button.addEventListener('click', function () {
    var code = codeBlock.querySelector('code').innerText.trim();
    window.navigator.clipboard.writeText(code);

     Button.innerText = 'Copied';
    var fourSeconds = 4000;

    setTimeout(function () {
       Button.innerText = 'Copy';
    }, fourSeconds);
  });
});
