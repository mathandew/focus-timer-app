// TIMER LOGIC
let duration = 25 * 60;
let timer = duration;
let interval = null;

const timerDisplay = document.getElementById('timer');
const timerProgress = document.getElementById('timerProgress');
const startBtn = document.getElementById('startBtn');
const pauseBtn = document.getElementById('pauseBtn');
const resetBtn = document.getElementById('resetBtn');
const customMinutes = document.getElementById('customMinutes');
const setTimerBtn = document.getElementById('setTimerBtn');
const alarmSound = document.getElementById('alarmSound');

const quotes = [
  "Small daily improvements are the key to staggering long-term results.",
  "Your daily choices and actions should support your goals.",
  "Focus on being productive instead of busy.",
  "The secret of getting ahead is getting started.",
  "Don’t count the days, make the days count.",
  "A goal without a plan is just a wish.",
  "Discipline is choosing between what you want now and what you want most.",
  "Success is the sum of small efforts, repeated day in and day out."
];

const quoteEl = document.getElementById('quote');

function displayRandomQuote() {
  const randomIndex = Math.floor(Math.random() * quotes.length);
  quoteEl.textContent = quotes[randomIndex];
}

displayRandomQuote();

document.getElementById('refreshQuote').addEventListener('click', displayRandomQuote);

function updateDisplay() {
  const minutes = Math.floor(timer / 60).toString().padStart(2, '0');
  const seconds = (timer % 60).toString().padStart(2, '0');
  timerDisplay.textContent = `${minutes}:${seconds}`;

  const percent = (timer / duration) * 100;
  timerProgress.style.width = `${percent}%`;
  timerProgress.setAttribute('aria-valuenow', percent.toFixed(0));
}

function startTimer() {
  if (interval) return;

  interval = setInterval(() => {
    if (timer > 0) {
      timer--;
      updateDisplay();

      if (timer === 5) {
        alarmSound.play().catch(err => console.log("Audio play blocked:", err));
      }

    } else {
      clearInterval(interval);
      interval = null;
      alert("Time's up!");
    }
  }, 1000);
}

function pauseTimer() {
  clearInterval(interval);
  interval = null;
}

function resetTimer() {
  pauseTimer();
  timer = duration;
  updateDisplay();
}

function setCustomTimer() {
  const mins = parseInt(customMinutes.value);
  if (!isNaN(mins) && mins > 0) {
    duration = mins * 60;
    timer = duration;
    updateDisplay();
  } else {
    alert("Please enter a valid number of minutes.");
  }
}

startBtn.addEventListener('click', startTimer);
pauseBtn.addEventListener('click', pauseTimer);
resetBtn.addEventListener('click', resetTimer);
setTimerBtn.addEventListener('click', setCustomTimer);

updateDisplay();

// THEME TOGGLE + PERSISTENCE
const body = document.getElementById('body');
const themeToggle = document.getElementById('themeToggle');
let darkMode = localStorage.getItem('darkMode') === 'true';

function applyTheme() {
  if (darkMode) {
    body.classList.remove('bg-light');
    body.classList.add('bg-dark', 'text-light');
  } else {
    body.classList.remove('bg-dark', 'text-light');
    body.classList.add('bg-light');
  }
  localStorage.setItem('darkMode', darkMode);
}
applyTheme();

themeToggle.addEventListener('click', () => {
  darkMode = !darkMode;
  applyTheme();
});

// GOALS LOGIC
const goalInput = document.getElementById('goalInput');
const addGoalBtn = document.getElementById('addGoalBtn');
const goalList = document.getElementById('goalList');
const progressSummary = document.getElementById('progressSummary');
const clearAllBtn = document.getElementById('clearAllBtn');
const exportGoalsBtn = document.getElementById('exportGoals');

let goals = JSON.parse(localStorage.getItem('goals')) || [];

function saveGoals() {
  localStorage.setItem('goals', JSON.stringify(goals));
}

function renderGoals() {
  goalList.innerHTML = '';
  goals.forEach((goal, index) => {
    const li = document.createElement('li');
    li.className = 'list-group-item d-flex justify-content-between align-items-center';
    li.innerHTML = `
      <span class="${goal.done ? 'text-decoration-line-through text-muted' : ''}">
        ${goal.text}
      </span>
      <div>
        <button class="btn btn-sm btn-success me-1" onclick="markDone(${index})">
          ${goal.done ? '✅' : '✔'}
        </button>
        <button class="btn btn-sm btn-danger" onclick="deleteGoal(${index})">🗑</button>
      </div>
    `;
    goalList.appendChild(li);
  });
  updateProgress();
}

function updateProgress() {
  const doneCount = goals.filter(g => g.done).length;
  const total = goals.length;
  progressSummary.textContent = `Completed ${doneCount} / ${total} goals`;
}

function addGoal() {
  const text = goalInput.value.trim();
  if (text !== '') {
    goals.push({ text, done: false });
    saveGoals();
    renderGoals();
    goalInput.value = '';
  }
}

function markDone(index) {
  goals[index].done = !goals[index].done;
  saveGoals();
  renderGoals();
}

function deleteGoal(index) {
  goals.splice(index, 1);
  saveGoals();
  renderGoals();
}

function clearAllGoals() {
  if (confirm("Are you sure you want to clear all goals?")) {
    goals = [];
    saveGoals();
    renderGoals();
  }
}

function exportGoals() {
  if (goals.length === 0) {
    alert("No goals to export.");
    return;
  }
  let csv = "Goal,Status\n";
  goals.forEach(g => {
    csv += `"${g.text}","${g.done ? 'Done' : 'Pending'}"\n`;
  });
  const blob = new Blob([csv], { type: 'text/csv' });
  const url = URL.createObjectURL(blob);

  const link = document.createElement('a');
  link.href = url;
  link.download = 'daily_goals.csv';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

addGoalBtn.addEventListener('click', addGoal);
goalInput.addEventListener('keypress', (e) => {
  if (e.key === 'Enter') addGoal();
});
clearAllBtn.addEventListener('click', clearAllGoals);
exportGoalsBtn.addEventListener('click', exportGoals);


renderGoals();
displayRandomQuote();