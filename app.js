// Display Today's Date
const dateEl = document.getElementById('todayDate');
const options = { weekday: 'long', year: 'numeric', month: 'short', day: 'numeric' };
dateEl.textContent = new Date().toLocaleDateString('en-US', options);

// Toggle Mood Buttons
document.querySelectorAll('.mood-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    document.querySelectorAll('.mood-btn').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    localStorage.setItem('selectedMood', btn.dataset.mood);
  });
});

// Toggle Day Buttons
document.querySelectorAll('.day-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    document.querySelectorAll('.day-btn').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    localStorage.setItem('selectedDay', btn.dataset.day);
  });
});

// Toggle Water Drops
document.querySelectorAll('.water-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    btn.classList.toggle('active');
    const activeDrops = [...document.querySelectorAll('.water-btn.active')].map(b => b.dataset.glass);
    localStorage.setItem('waterDrops', JSON.stringify(activeDrops));
  });
});

// Task Lists Logic
const lists = ['priorities', 'todo', 'appointment', 'shopping'];

function updateProgress() {
  const todos = JSON.parse(localStorage.getItem('todo')) || [];
  const fill = document.getElementById('progressFill');
  const text = document.getElementById('progressText');
  if (todos.length === 0) {
    fill.style.width = '0%';
    text.textContent = '0%';
    return;
  }
  const completed = todos.filter(t => t.done).length;
  const percent = Math.round((completed / todos.length) * 100);
  fill.style.width = `${percent}%`;
  text.textContent = `${percent}%`;
}

function addTask(type) {
  const input = document.getElementById(`${type}Input`);
  const text = input.value.trim();
  if (!text) return;

  const tasks = JSON.parse(localStorage.getItem(type)) || [];
  tasks.push({ text, done: false });
  localStorage.setItem(type, JSON.stringify(tasks));
  input.value = '';
  renderTasks(type);
}

function toggleTask(type, index) {
  const tasks = JSON.parse(localStorage.getItem(type)) || [];
  tasks[index].done = !tasks[index].done;
  localStorage.setItem(type, JSON.stringify(tasks));
  renderTasks(type);
}

function deleteTask(type, index) {
  const tasks = JSON.parse(localStorage.getItem(type)) || [];
  tasks.splice(index, 1);
  localStorage.setItem(type, JSON.stringify(tasks));
  renderTasks(type);
}

function renderTasks(type) {
  const listEl = document.getElementById(`${type}List`);
  const tasks = JSON.parse(localStorage.getItem(type)) || [];
  listEl.innerHTML = tasks.map((task, idx) => `
    <li class="task-item">
      <div class="task-left ${task.done ? 'done' : ''}" onclick="toggleTask('${type}', ${idx})">
        <input type="checkbox" ${task.done ? 'checked' : ''}>
        <span>${task.text}</span>
      </div>
      <button class="delete-btn" onclick="deleteTask('${type}', ${idx})">×</button>
    </li>
  `).join('');

  if (type === 'todo') updateProgress();
}

// Auto-save simple text fields
const textFields = ['playlistInput', 'gratitudeInput', 'mealBreakfast', 'mealLunch', 'mealDinner', 'notesArea'];
textFields.forEach(id => {
  const el = document.getElementById(id);
  el.value = localStorage.getItem(id) || '';
  el.addEventListener('input', () => localStorage.setItem(id, el.value));
});

// Auto-save Mini Habits
['habit1', 'habit2', 'habit3', 'habit4'].forEach(id => {
  const cb = document.getElementById(id);
  cb.checked = localStorage.getItem(id) === 'true';
  cb.addEventListener('change', () => localStorage.setItem(id, cb.checked));
});

// Allow Enter key to add tasks
lists.forEach(type => {
  renderTasks(type);
  document.getElementById(`${type}Input`).addEventListener('keypress', e => {
    if (e.key === 'Enter') addTask(type);
  });
});

// Reset All Planner Data
function resetPlanner() {
  if (confirm('Clear all tasks and trackers for a fresh start? 🌸')) {
    localStorage.clear();
    location.reload();
  }
}

// Restore Day, Mood & Water on Load
window.addEventListener('DOMContentLoaded', () => {
  const savedDay = localStorage.getItem('selectedDay');
  if (savedDay) {
    const dayBtn = document.querySelector(`.day-btn[data-day="${savedDay}"]`);
    if (dayBtn) dayBtn.classList.add('active');
  }
  const savedMood = localStorage.getItem('selectedMood');
  if (savedMood) {
    const moodBtn = document.querySelector(`.mood-btn[data-mood="${savedMood}"]`);
    if (moodBtn) moodBtn.classList.add('active');
  }
  const savedDrops = JSON.parse(localStorage.getItem('waterDrops')) || [];
  savedDrops.forEach(glass => {
    const dropBtn = document.querySelector(`.water-btn[data-glass="${glass}"]`);
    if (dropBtn) dropBtn.classList.add('active');
  });
});
