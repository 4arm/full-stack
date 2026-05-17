// Simple JavaScript app example
function greet(name) {
  return `Hello, ${name}! Welcome to app.js.`;
}

function add(a, b) {
  return a + b;
}

function redirectToYouTube() {
  window.location.href = 'https://www.youtube.com';
}

function showLocalTime() {
  const now = new Date();
  const localTime = now.toLocaleTimeString();
  const timeElement = document.getElementById('localTime');
  if (timeElement) {
    timeElement.textContent = localTime;
  }
}

function handleAddClick() {
  const input1 = document.getElementById('num1');
  const input2 = document.getElementById('num2');
  const resultElement = document.getElementById('sumResult');

  if (!input1 || !input2 || !resultElement) {
    return;
  }

  const value1 = parseFloat(input1.value);
  const value2 = parseFloat(input2.value);

  if (Number.isNaN(value1) || Number.isNaN(value2)) {
    resultElement.textContent = 'Please enter two valid numbers.';
    return;
  }

  resultElement.textContent = `Sum: ${add(value1, value2)}`;
}

function initPage() {
  const user = 'Izham';
  console.log(greet(user));
  console.log('2 + 3 =', add(2, 3));

  const youtubeButton = document.getElementById('youtubeButton');
  if (youtubeButton) {
    youtubeButton.addEventListener('click', redirectToYouTube);
  }

  const addButton = document.getElementById('addButton');
  if (addButton) {
    addButton.addEventListener('click', handleAddClick);
  }

  const menuToggle = document.getElementById('menuToggle');
  const navLinks = document.getElementById('navLinks');
  const topbar = document.getElementById('topbar');

  function toggleMobileMenu() {
    if (!navLinks || !menuToggle) return;
    const isOpen = navLinks.classList.toggle('nav-open');
    menuToggle.setAttribute('aria-expanded', String(isOpen));
  }

  if (menuToggle && navLinks) {
    menuToggle.addEventListener('click', (event) => {
      event.stopPropagation();
      toggleMobileMenu();
    });

    navLinks.addEventListener('click', (event) => {
      if (event.target.tagName === 'A') {
        navLinks.classList.remove('nav-open');
        menuToggle.setAttribute('aria-expanded', 'false');
      }
    });
  }

  if (topbar && navLinks && menuToggle) {
    topbar.addEventListener('click', (event) => {
      if (window.innerWidth > 720) return;
      if (event.target.closest('#navLinks') || event.target.closest('#menuToggle')) return;
      toggleMobileMenu();
    });
  }

  showLocalTime();
  setInterval(showLocalTime, 1000);

  const TODO_STORAGE_KEY = 'dashboardTodos';
  let todos = [];

  function loadTodos() {
    const stored = localStorage.getItem(TODO_STORAGE_KEY);
    todos = stored ? JSON.parse(stored) : [];
    renderTodos();
  }

  function saveTodos() {
    localStorage.setItem(TODO_STORAGE_KEY, JSON.stringify(todos));
  }

  function updateTodoCount() {
    const todoCount = document.getElementById('todoCount');
    if (!todoCount) return;
    const remaining = todos.filter((todo) => !todo.done).length;
    const label = remaining === 1 ? 'task left' : 'tasks left';
    todoCount.textContent = `${remaining} ${label}`;
  }

  function renderTodos() {
    const todoList = document.getElementById('todoList');
    if (!todoList) return;

    todoList.innerHTML = todos
      .map(
        (todo, index) =>
          `<li class="todo-item ${todo.done ? 'completed' : ''}" data-index="${index}">
            <span>${todo.text}</span>
            <button type="button" class="todo-remove">✕</button>
          </li>`
      )
      .join('');

    updateTodoCount();
  }

  function addTodo() {
    const todoInput = document.getElementById('todoInput');
    if (!todoInput) return;

    const text = todoInput.value.trim();
    if (!text) return;

    todos.push({ text, done: false });
    saveTodos();
    renderTodos();
    todoInput.value = '';
  }

  function toggleTodoDone(index) {
    if (typeof todos[index] === 'undefined') return;
    todos[index].done = !todos[index].done;
    saveTodos();
    renderTodos();
  }

  function removeTodo(index) {
    todos.splice(index, 1);
    saveTodos();
    renderTodos();
  }

  function clearCompletedTodos() {
    todos = todos.filter((todo) => !todo.done);
    saveTodos();
    renderTodos();
  }

  const todoAddButton = document.getElementById('todoAddButton');
  if (todoAddButton) {
    todoAddButton.addEventListener('click', addTodo);
  }

  const todoInput = document.getElementById('todoInput');
  if (todoInput) {
    todoInput.addEventListener('keypress', (event) => {
      if (event.key === 'Enter') {
        event.preventDefault();
        addTodo();
      }
    });
  }

  const todoList = document.getElementById('todoList');
  if (todoList) {
    todoList.addEventListener('click', (event) => {
      const item = event.target.closest('.todo-item');
      if (!item) return;
      const index = Number(item.getAttribute('data-index'));

      if (event.target.classList.contains('todo-remove')) {
        removeTodo(index);
      } else {
        toggleTodoDone(index);
      }
    });
  }

  const clearTodosButton = document.getElementById('clearTodosButton');
  if (clearTodosButton) {
    clearTodosButton.addEventListener('click', clearCompletedTodos);
  }

  loadTodos();
}

document.addEventListener('DOMContentLoaded', initPage);

