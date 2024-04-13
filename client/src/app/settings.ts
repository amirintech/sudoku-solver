export function renderSettings() {
  const container = document.getElementById("settings");
  container.innerHTML = `
    <h2 class="text-white font-bold text-3xl mb-6">Engine Settings</h2>

    <div class="space-y-3">
        <div class="menu">
            <p class="menu-title">
                Difficulity Level
            </p>

            <button class="menu-btn">
                Hard
            </button>

            <ul class="hidden">
                <li>1</li>
                <li>2</li>
                <li>3</li>
            </ul>
        </div>

        <div class="menu">
            <p class="menu-title">
                Algorithm
            </p>

            <button class="menu-btn">
                Backtracking
            </button>

            <ul class="hidden">
                <li>1</li>
                <li>2</li>
                <li>3</li>
            </ul>
        </div>
    </div>
    `;
}
