export function openModal() {
  document.body.innerHTML += `
    <div class="w-screen h-screen absolute top-0 left-0 before:bg-gradient-to-br before:from-pink-600/20 before:to-sky-600/20 before:w-full before:h-full before:absolute before:top-0 before:left-0 before:animate-pulse">

    </div>
    `;
}
