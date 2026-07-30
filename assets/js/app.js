const btnEn = document.querySelector(".english");
const btnHi = document.querySelector(".hindi");
const btnGu = document.querySelector(".gujrati");

const DEFAULT_LANG = "English";
const LANG_KEY = "selectedLanguage";

let translations = {};

// per-language audio files
const langSounds = {
  English: new Audio("./assets/audio/Eng.mpeg"),
  Hindi: new Audio("./assets/audio/Hin.mpeg"),
  Gujarati: new Audio("./assets/audio/Guj.mpeg"),
};

Object.values(langSounds).forEach((audio) => {
  audio.preload = "auto";
});

function playLangSound(lang) {
  const audio = langSounds[lang];
  if (!audio) return;

  audio.currentTime = 0;
  audio.play().catch(() => {});
}

// get saved language immediately
const savedLang = localStorage.getItem(LANG_KEY) || DEFAULT_LANG;

// apply language attribute early to avoid English flash
if (savedLang === "English") {
  document.documentElement.lang = "en";
  document.body?.setAttribute("data-lang", "en");
} else if (savedLang === "Hindi") {
  document.documentElement.lang = "hi";
  document.body?.setAttribute("data-lang", "hi");
} else if (savedLang === "Gujarati") {
  document.documentElement.lang = "gu";
  document.body?.setAttribute("data-lang", "gu");
}

// set active button
function setActiveButton(activeBtn) {
  [btnEn, btnHi, btnGu].forEach((btn) => btn?.classList.remove("active"));
  activeBtn?.classList.add("active");
}

// apply language
function applyLanguage(lang) {
  const langData = translations[lang];
  if (!langData) return;

  localStorage.setItem(LANG_KEY, lang);

  if (lang === "English") {
    document.documentElement.lang = "en";
    document.body.setAttribute("data-lang", "en");
    setActiveButton(btnEn);
  } else if (lang === "Hindi") {
    document.documentElement.lang = "hi";
    document.body.setAttribute("data-lang", "hi");
    setActiveButton(btnHi);
  } else if (lang === "Gujarati") {
    document.documentElement.lang = "gu";
    document.body.setAttribute("data-lang", "gu");
    setActiveButton(btnGu);
  }

  document.querySelectorAll("[data-lang-key]").forEach((el) => {
    const key = el.getAttribute("data-lang-key");

    if (langData[key] !== undefined) {
      el.innerHTML = String(langData[key]).replace(/\n/g, "<br>");
    }
  });
}

// body fade in on page load
window.addEventListener("DOMContentLoaded", () => {
  document.body.classList.add("page-loaded");

  fetch("./assets/json/data.json", { cache: "no-store" })
    .then((res) => res.json())
    .then((data) => {
      translations = data;

      const currentLang = localStorage.getItem(LANG_KEY) || DEFAULT_LANG;
      applyLanguage(currentLang);
    })
    .catch((err) => console.error("Error loading translations:", err));
});

// optional fade out function for page navigation
function pageFadeOut(url) {
  document.body.classList.add("page-exit");

  setTimeout(() => {
    window.location.href = url;
  }, 500);
}

// button clicks
btnEn?.addEventListener("click", () => {
  playLangSound("English");
  applyLanguage("English");
});
btnHi?.addEventListener("click", () => {
  playLangSound("Hindi");
  applyLanguage("Hindi");
});
btnGu?.addEventListener("click", () => {
  playLangSound("Gujarati");
  applyLanguage("Gujarati");
});