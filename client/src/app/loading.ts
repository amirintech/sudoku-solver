const content = document.getElementById("content");

function init() {
  content.classList.add("before:opacity-0");
}

init();

export function toggleLoadingAnimation() {
  content.classList.toggle("before:opacity-100");
}
