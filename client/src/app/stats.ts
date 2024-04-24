import cpuIcon from "../assets/icons/cpu.svg";
import memoryIcon from "../assets/icons/memory-stick.svg";
import iterationIcon from "../assets/icons/iteration-ccw.svg";

export function renderStats(
  executionTime: number,
  memoryUsage: number,
  iterationsCount: number
) {
  const container = document.getElementById("stats") as HTMLElement;
  const time = Number(executionTime.toFixed(3));
  container.innerHTML = `
    <h2 class="text-white font-bold text-3xl">Stats for Nerds</h2>
    <ul class="mt-6 flex items-center w-full justify-between">    
        <li class="stats-item">
            <span class="stats-value">${time === 0 ? 0 : time}</span>
            <span class="stats-unit">seconds</span>
            <img class="stats-icon" src=${cpuIcon} />
        </li>

        <li class="stats-item">
            <span class="stats-value">${memoryUsage}</span>
            <span class="stats-unit">bytes</span>
            <img class="stats-icon" src=${memoryIcon} />
        </li>
        
        <li class="stats-item">
            <span class="stats-value">${iterationsCount}</span>
            <span class="stats-unit">iterations</span>
            <img class="stats-icon" src=${iterationIcon} />
        </li>
    </ul>
    `;
}
