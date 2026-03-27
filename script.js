function detectOS() {
  const ua = navigator.userAgent;
  if (ua.includes("Windows")) return "Windows";
  if (ua.includes("Mac")) return "macOS";
  if (ua.includes("Android")) return "Android";
  if (ua.includes("iPhone") || ua.includes("iPad")) return "iOS";
  if (ua.includes("Linux")) return "Linux";
  return "Невідома ОС";
}

function detectBrowser() {
  const ua = navigator.userAgent;
  if (ua.includes("Edg")) return "Microsoft Edge";
  if (ua.includes("OPR") || ua.includes("Opera")) return "Opera";
  if (ua.includes("Chrome")) return "Google Chrome";
  if (ua.includes("Safari") && !ua.includes("Chrome")) return "Safari";
  if (ua.includes("Firefox")) return "Mozilla Firefox";
  return "Невідомий браузер";
}

function saveClientInfo() {
  localStorage.setItem("os", detectOS());
  localStorage.setItem("browser", detectBrowser());
  localStorage.setItem("language", navigator.language);
  localStorage.setItem("platform", navigator.platform);
}

function renderLocalStorage() {
  const output = document.getElementById("storageOutput");
  if (!output) return;
  output.innerHTML = "";
  for (let i = 0; i < localStorage.length; i++) {
    const key = localStorage.key(i);
    const value = localStorage.getItem(key);
    const row = document.createElement("div");
    row.className = "storage-item";
    row.textContent = `${key}: ${value}`;
    output.appendChild(row);
  }
}

const POST_ID = 1;

async function loadComments() {
  const status = document.getElementById("commentsStatus");
  const list = document.getElementById("commentsList");
  if (!status || !list) return;

  status.textContent = "Завантаження...";
  list.innerHTML = "";

  try {
    const res = await fetch(`https://jsonplaceholder.typicode.com/posts/${POST_ID}/comments`);
    if (!res.ok) throw new Error(`HTTP ${res.status}`);

    const comments = await res.json();
    status.textContent = `Отримано коментарів: ${comments.length}`;

    comments.forEach((comment) => {
      const card = document.createElement("article");
      card.className = "comment";
      card.innerHTML = `
        <h4>${comment.name}</h4>
        <div class="email">${comment.email}</div>
        <p>${comment.body.replace(/\n/g, "<br>")}</p>
      `;
      list.appendChild(card);
    });
  } catch (e) {
    console.error(e);
    status.textContent = "Не вдалося завантажити коментарі.";
  }
}

function initFeedbackModal() {
  const modal = document.getElementById("feedbackModal");
  const closeBtn = document.getElementById("closeModalBtn");
  if (!modal || !closeBtn) return;

  setTimeout(() => {
    modal.classList.remove("hidden");
  }, 60000);

  closeBtn.addEventListener("click", () => {
    modal.classList.add("hidden");
  });

  modal.addEventListener("click", (e) => {
    if (e.target === modal) modal.classList.add("hidden");
  });
}


function getAutoThemeByTime() {
  const hour = new Date().getHours();
  return (hour >= 7 && hour < 21) ? "light-theme" : "dark-theme";
}

function applyTheme(themeName) {
  document.body.classList.remove("light-theme", "dark-theme");
  document.body.classList.add(themeName);
  localStorage.setItem("theme", themeName);

  const btn = document.getElementById("themeToggleBtn");
  if (btn) {
    btn.textContent = themeName === "light-theme"
      ? "Перемкнути на нічну"
      : "Перемкнути на денну";
  }
}

function initTheme() {
  const savedTheme = localStorage.getItem("theme");
  const initialTheme = savedTheme || getAutoThemeByTime();
  applyTheme(initialTheme);

  const btn = document.getElementById("themeToggleBtn");
  if (!btn) return;

  btn.addEventListener("click", () => {
    const isLight = document.body.classList.contains("light-theme");
    applyTheme(isLight ? "dark-theme" : "light-theme");
  });
}

saveClientInfo();
renderLocalStorage();
loadComments();
initFeedbackModal();
initTheme();