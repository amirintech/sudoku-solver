import { Win } from "../types";

const win = window as unknown as Win;

export function openTestInfoModal() {
  const { modal, overlay } = openModal();

  const content = document.createElement("div");
  content.classList.add("modal-content");
  content.innerHTML = `
    <h2 class="text-white font-bold text-3xl">
      Algorithms Benchmarks
    </h2>
    <p class="text-white/70 text-center !mt-6">
      This tool benchmarks the backtracking and genetic algorithms using a dataset of 10,000 test cases to compare their speed. A random 500 is drawn from the dataset and used to evaluate the algorithm. It evaluates each algorithm's performance by processing test data and checking solutions, providing essential insights for optimization and application in real-world scenarios.
    </p>
  `;

  const actionBtn = document.createElement("button");
  actionBtn.classList.add("btn", "btn-grey", "w-full", "hover:!scale-100");
  actionBtn.textContent = "Start";

  content.appendChild(actionBtn);
  modal.appendChild(content);

  actionBtn.onclick = () => {
    overlay.remove();
    openTestModal();
    win.api.runTests();
  };
}

function openTestModal() {
  const { modal } = openModal();

  const timerContainter = document.createElement("div");
  const timer = document.createElement("span");
  timerContainter.classList.add("timer");
  timerContainter.innerHTML = `
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#a5b3fc" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-clock"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
  `;
  timerContainter.appendChild(timer);
  timer.textContent = "00:00";
  // const timerId = startTimer(timer);

  const stepsContainer = document.createElement("div");
  stepsContainer.classList.add("steps");
  const steps = {
    "0-loading": createStep("Loading test cases from dataset"),
    "1-testing": createStep(
      'Testing engine on random sample. Running test case <span class="case-count">0</span>/500'
    ),
    "2-done": createStep(" All tests have been successfully completed"),
  };
  const completedSteps = new Set();

  stepsContainer.appendChild(steps["0-loading"]);

  modal.appendChild(timerContainter);
  modal.appendChild(stepsContainer);

  const timerId = startTimer(timer);

  win.api.onRunTests((res) => {
    const loadingSetp = steps["0-loading"];
    const testingStep = steps["1-testing"];
    const doneStep = steps["2-done"];
    if (!completedSteps.has(loadingSetp)) {
      completedSteps.add(loadingSetp);
      stepCompleted(loadingSetp);
      stepsContainer.appendChild(testingStep);
    }
    if (!res.data.done)
      updateCaseCount(res.data.testCaseNumber + 2, testingStep);
    else {
      stepCompleted(testingStep);
      stepsContainer.appendChild(doneStep);
      stepCompleted(doneStep);
      stopTimer(timerId);
    }
  });
}

function startTimer(timer: HTMLSpanElement) {
  let totalTime = 0;
  const interval = setInterval(() => {
    totalTime++;
    const minutes = Math.floor(totalTime / 60);
    const seconds = totalTime % 60;

    const strMinutes = String(minutes).padStart(2, "0");
    const strSeconds = String(seconds).padStart(2, "0");

    timer.textContent = `${strMinutes}:${strSeconds}`;
  }, 1000);

  return interval;
}

function stopTimer(intervalId: NodeJS.Timeout) {
  clearInterval(intervalId);
}

function createStep(title: string) {
  const stepContainer = document.createElement("div");
  stepContainer.classList.add("step");

  stepContainer.innerHTML = `
  <div class="icon animate-spin w-fit h-fit">
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#e0e7ff" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-loader-circle"><path d="M21 12a9 9 0 1 1-6.219-8.56"/></svg>
  </div>
  <p>${title}</p>
  `;

  return stepContainer;
}

function stepCompleted(div: HTMLDivElement) {
  const icon = div.querySelector(".icon");
  icon.innerHTML = `
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#059669" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-check-check"><path d="M18 6 7 17l-5-5"/><path d="m22 10-7.5 7.5L13 16"/></svg>
  `;

  icon.classList.remove("animate-spin");

  div.classList.add("!text-emerald-500");
}

function updateCaseCount(num: number, step: HTMLDivElement) {
  step.querySelector(".case-count").textContent = String(num);
}

function openModal() {
  const overlay = document.createElement("div");
  overlay.classList.add("modal-overlay");

  const modal = document.createElement("div");
  modal.classList.add("modal");

  const closeBtn = document.createElement("button");
  closeBtn.classList.add("modal-close-btn");
  closeBtn.innerHTML = `
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#cfeaf0" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-x"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>
  `;

  modal.appendChild(closeBtn);
  overlay.appendChild(modal);
  document.body.appendChild(overlay);

  closeBtn.onclick = () => {
    overlay.remove();
  };

  return {
    overlay,
    modal,
    closeBtn,
  };
}
