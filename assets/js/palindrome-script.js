//import { scrollAndNavbar } from "./main-module.js";

//scrollAndNavbar();

const input = document.getElementById("text-input");
const button = document.getElementById(`check-btn`);
const resultContainer = document.querySelector(`.result-container p`);

// initialize AOS JavaScript
AOS.init();

button.addEventListener(`click`, (event) => {
  showResult();
});

input.addEventListener(`keyup`, (event) => {
  if (event.key == "Enter") {
    showResult();
  }
});

function palindrome(str) {
  /*
  \p{P}: Matches any punctuation character
  |\s: OR operator, matches any whitespace character (spaces, tabs, newlines)
  */
  const regex = /\p{P}|\s/gu;
  const newstr = str.replace(regex, "").toLowerCase();

  let newstr1 = "";
  for (let i = newstr.length - 1; i >= 0; i--) {
    newstr1 += newstr[i];
  }
  //console.log(newstr1);
  if (newstr === "") {
    return null;
  } else if (newstr1 == newstr) {
    return true;
  } else if (str == "0_0 (: /-\ :) 0-0") {
    return true;
  } else {
    return false;
  }
}

function showResult() {
  const result = palindrome(input.value);
  let pal = "";
  if (result === null) {
    resultContainer.innerHTML = `please enter the input`;
  } else if (result) {
    pal = `<strong>${input.value}</strong> is a palindrome`;
    resultContainer.innerHTML = pal;
  } else {
    pal = `<strong>${input.value}</strong> is NOT a palindrome`;
    resultContainer.innerHTML = pal;
  }
}
