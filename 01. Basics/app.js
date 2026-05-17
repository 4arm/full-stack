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

  showLocalTime();
  setInterval(showLocalTime, 1000);
}

document.addEventListener('DOMContentLoaded', initPage);

