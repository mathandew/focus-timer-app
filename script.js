// TIMER LOGIC
let duration = 25 * 60;
let timer = duration;
let interval = null;

const timerDisplay = document.getElementById('timer');
const startBtn = document.getElementById('startBtn');
const pauseBtn = document.getElementById('pauseBtn');
const resetBtn = document.getElementById('resetBtn');
const customMinutes = document.getElementById('customMinutes');
const setTimerBtn = document.getElementById('setTimerBtn');

function updateDisplay() {
  const minutes = Math.floor(timer / 60).toString().padStart(2, '0');
  const seconds = (timer % 60).toString().padStart(2, '0');
  timerDisplay.textContent = `${minutes}:${seconds}`;
}

function startTimer() {
  if (interval) return;

  interval = setInterval(() => {
    if (timer > 0) {
      timer--;
      updateDisplay();
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

// THEME TOGGLE
const body = document.getElementById('body');
const themeToggle = document.getElementById('themeToggle');
let darkMode = false;

themeToggle.addEventListener('click', () => {
  darkMode = !darkMode;
  if (darkMode) {
    body.classList.remove('bg-light');
    body.classList.add('bg-dark', 'text-light');
  } else {
    body.classList.remove('bg-dark', 'text-light');
    body.classList.add('bg-light');
  }
});

// GOALS LOGIC
const goalInput = document.getElementById('goalInput');
const addGoalBtn = document.getElementById('addGoalBtn');
const goalList = document.getElementById('goalList');
const progressSummary = document.getElementById('progressSummary');
const clearAllBtn = document.getElementById('clearAllBtn');

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

addGoalBtn.addEventListener('click', addGoal);
goalInput.addEventListener('keypress', (e) => {
  if (e.key === 'Enter') addGoal();
});
clearAllBtn.addEventListener('click', clearAllGoals);

renderGoals();
