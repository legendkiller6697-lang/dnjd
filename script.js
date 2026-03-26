const form = document.getElementById("messPassForm");
const photoInput = document.getElementById("photoInput");
const nameInput = document.getElementById("nameInput");
const regInput = document.getElementById("regInput");
const mealInput = document.getElementById("mealInput");
const hostelInput = document.getElementById("hostelInput");
const colorInput = document.getElementById("colorInput");
const colorCodeInput = document.getElementById("colorCodeInput");

const previewPhoto = document.getElementById("previewPhoto");
const previewQr = document.getElementById("previewQr");
const previewName = document.getElementById("previewName");
const previewReg = document.getElementById("previewReg");
const previewDate = document.getElementById("previewDate");
const previewTime = document.getElementById("previewTime");
const approvalText = document.getElementById("approvalText");
const rateBox = document.getElementById("rateBox");
const countdownBadge = document.getElementById("countdownBadge");
const previewMeal = document.getElementById("previewMeal");
const previewMess = document.getElementById("previewMess");
const previewAssignedMess = document.getElementById("previewAssignedMess");
const previewHostelDetail = document.getElementById("previewHostelDetail");

const defaultPhoto =
  "data:image/svg+xml;utf8," +
  encodeURIComponent(`
    <svg xmlns="http://www.w3.org/2000/svg" width="176" height="176" viewBox="0 0 176 176">
      <rect width="176" height="176" fill="#efefef" />
      <circle cx="88" cy="65" r="32" fill="#c6c6c6" />
      <rect x="35" y="108" width="106" height="44" rx="18" fill="#c6c6c6" />
    </svg>
  `);

if (previewPhoto) {
  previewPhoto.src = defaultPhoto;
}

function formatDate(date) {
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(date);
}

function formatTime(date) {
  return new Intl.DateTimeFormat("en-US", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  }).format(date);
}

function isValidHex(value) {
  return /^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/.test(value);
}

function updateAccent(color) {
  document.documentElement.style.setProperty("--accent", color);
  approvalText.style.color = color;
  rateBox.style.boxShadow = `0 0 0 1px ${color}25`;
}

function buildQrUrl(name, regNo, meal, mess) {
  const qrPayload = `Name: ${name}\nReg No: ${regNo}\nMeal: ${meal}\nMess: ${mess}`;
  return `https://api.qrserver.com/v1/create-qr-code/?size=220x220&data=${encodeURIComponent(qrPayload)}`;
}

function buildMessName(hostelNumber) {
  return `Mess BH-${hostelNumber}`;
}

function buildHostelDetail(hostelNumber) {
  const roomMap = {
    "1": "Boys Hostel-01 - A112-Bed C (Standard AC 4 Seater)",
    "2": "Boys Hostel-02 - B204-Bed A (Standard Non-AC 3 Seater)",
    "3": "Boys Hostel-03 - B220-Bed A (Standard Air Conditioned 4 Seater)",
    "4": "Boys Hostel-04 - C109-Bed D (Premium AC 4 Seater)",
    "5": "Boys Hostel-05 - C118-Bed B (Standard Non-AC 3 Seater)",
    "6": "Boys Hostel-06 - D305-Bed A (Premium AC 2 Seater)",
  };

  return roomMap[hostelNumber] || roomMap["3"];
}

if (colorInput && colorCodeInput) {
  colorInput.addEventListener("input", () => {
    colorCodeInput.value = colorInput.value;
  });

  colorCodeInput.addEventListener("input", () => {
    if (isValidHex(colorCodeInput.value)) {
      colorInput.value = colorCodeInput.value;
    }
  });
}

if (form) {
  form.addEventListener("submit", (event) => {
    event.preventDefault();

    const name = nameInput.value.trim() || "Akshit kala";
    const regNo = regInput.value.trim() || "12416321";
    const meal = mealInput.value || "Lunch";
    const hostelNumber = hostelInput.value || "3";
    const accent = isValidHex(colorCodeInput.value) ? colorCodeInput.value : colorInput.value;
    const file = photoInput.files[0];

    const navigateToPass = (photoDataUrl) => {
      sessionStorage.setItem("mess-pass-photo", photoDataUrl || defaultPhoto);
      const params = new URLSearchParams({
        name,
        regNo,
        meal,
        hostel: hostelNumber,
        accent,
      });
      window.location.href = `pass.html?${params.toString()}`;
    };

    if (file) {
      const reader = new FileReader();
      reader.onload = () => navigateToPass(reader.result);
      reader.readAsDataURL(file);
      return;
    }

    navigateToPass(defaultPhoto);
  });
}

if (previewName && previewReg && previewDate && previewTime && previewQr && approvalText) {
  const params = new URLSearchParams(window.location.search);
  const name = params.get("name") || "Akshit kala";
  const regNo = params.get("regNo") || "12416321";
  const meal = params.get("meal") || "Lunch";
  const hostelNumber = params.get("hostel") || "3";
  const accent = isValidHex(params.get("accent") || "") ? params.get("accent") : "#63d61f";
  const now = new Date();
  const storedPhoto = sessionStorage.getItem("mess-pass-photo");
  const messName = buildMessName(hostelNumber);

  previewName.textContent = name;
  previewReg.textContent = regNo;
  previewDate.textContent = formatDate(now);
  previewTime.textContent = formatTime(now);
  previewQr.src = buildQrUrl(name, regNo, meal, messName);
  previewPhoto.src = storedPhoto || defaultPhoto;
  if (previewMeal) {
    previewMeal.textContent = meal;
  }
  if (previewMess) {
    previewMess.textContent = messName;
  }
  if (previewAssignedMess) {
    previewAssignedMess.textContent = `Your Assigned Mess - ${messName}`;
  }
  if (previewHostelDetail) {
    previewHostelDetail.textContent = buildHostelDetail(hostelNumber);
  }
  updateAccent(accent);

  if (countdownBadge) {
    let secondsLeft = 30;
    countdownBadge.textContent = String(secondsLeft);

    window.setInterval(() => {
      secondsLeft = secondsLeft > 0 ? secondsLeft - 1 : 30;
      countdownBadge.textContent = String(secondsLeft).padStart(2, "0");
    }, 1000);
  }
}
