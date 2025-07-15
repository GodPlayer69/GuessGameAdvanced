let max = 100;
let secret = 0;
let attempts = 10;
let score = Number(localStorage.getItem("score")) || 0;

const guessInput = document.getElementById("guessInput");
const guessButton = document.getElementById("guessButton");
const restartButton = document.getElementById("restartButton");
const resetScoreButton = document.getElementById("resetScoreButton");
const message = document.getElementById("message");
const attemptsDisplay = document.getElementById("attempts");
const scoreDisplay = document.getElementById("score");
const difficulty = document.getElementById("difficulty");
const correctSound = document.getElementById("correctSound");
const wrongSound = document.getElementById("wrongSound");

function updateScoreDisplay() {
  scoreDisplay.textContent = `Puan: ${score}`;
  localStorage.setItem("score", score);
}

function startGame() {
  max = Number(difficulty.value);
  secret = Math.floor(Math.random() * max) + 1;
  attempts = 10;
  guessInput.value = "";
  message.textContent = `1 ile ${max} arasında bir sayı tahmin et.`;
  attemptsDisplay.textContent = `Hak: ${attempts}`;
  updateScoreDisplay();
  guessButton.disabled = false;
  restartButton.style.display = "none";
  message.classList.remove("animate-win");
}

function endGame(win) {
  guessButton.disabled = true;
  restartButton.style.display = "inline-block";

  if (win) {
    message.textContent = `🎉 Tebrikler! Doğru sayı: ${secret}`;
    message.classList.add("animate-win");
    score += attempts * 10;
    updateScoreDisplay();
    correctSound.play();
  } else {
    message.textContent = `😢 Kayıp! Doğru sayı: ${secret}`;
    wrongSound.play();
  }
}

guessButton.addEventListener("click", () => {
  const guess = Number(guessInput.value);
  if (!guess || guess < 1 || guess > max) {
    message.textContent = `Lütfen 1 ile ${max} arasında bir sayı gir.`;
    return;
  }

  if (guess === secret) {
    endGame(true);
    if (win) {
  const gained = attempts * 10;
  score += gained;
  updateScoreDisplay();
  correctSound.play();
  message.classList.add("animate-win");
  addScoreToTable(max, attempts, gained);
}
  } else {
    attempts--;
    wrongSound.play();
    if (attempts === 0) {
      endGame(false);
      wrongSound.play();
document.body.classList.add("wrong-flash");
setTimeout(() => document.body.classList.remove("wrong-flash"), 300);

    } else {
      message.textContent = guess < secret ? "⬆️ Daha büyük bir sayı dene." : "⬇️ Daha küçük bir sayı dene.";
      attemptsDisplay.textContent = `Hak: ${attempts}`;
    }
  }
});

restartButton.addEventListener("click", startGame);
difficulty.addEventListener("change", startGame);

resetScoreButton.addEventListener("click", () => {
  score = 0;
  updateScoreDisplay();
  alert("Skor sıfırlandı!");
});

startGame();

function addScoreToTable(difficulty, attemptsLeft, gainedScore) {
  const scores = JSON.parse(localStorage.getItem("scoreTable")) || [];
  const now = new Date().toLocaleString("tr-TR");
  scores.push({
    date: now,
    difficulty: `1-${max}`,
    attempts: attemptsLeft,
    score: gainedScore
  });
  localStorage.setItem("scoreTable", JSON.stringify(scores));
  renderScoreTable();
}

function renderScoreTable() {
  const tbody = document.querySelector("#scoreTable tbody");
  tbody.innerHTML = "";
  const scores = JSON.parse(localStorage.getItem("scoreTable")) || [];
  scores.forEach(entry => {
    const row = document.createElement("tr");
    row.innerHTML = `
      <td>${entry.date}</td>
      <td>${entry.difficulty}</td>
      <td>${entry.attempts}</td>
      <td>${entry.score}</td>
    `;
    tbody.appendChild(row);
  });
}
