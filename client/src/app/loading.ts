const content = document.getElementById("content");

export function playLoadingAnimation() {
  content.classList.remove("before:opacity-0");
  content.classList.add("before:opacity-100");
}

export function stopLoadingAnimation() {
  content.classList.add("before:opacity-0");
  content.classList.remove("before:opacity-100");
}

stopLoadingAnimation();
