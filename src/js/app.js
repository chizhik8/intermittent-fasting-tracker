let startTime;
let timerInterval;
let isRunning = false;

const timerDisplay = document.getElementById('timer');
const startBtn = document.getElementById('startBtn');
const stopBtn = document.getElementById('stopBtn');

startBtn.addEventListener('click', startFasting);
stopBtn.addEventListener('click', stopFasting);

function startFasting() {
    if (!isRunning) {
        isRunning = true;
        startTime = new Date().getTime();
        timerInterval = setInterval(updateTimer, 1000);
        startBtn.disabled = true;
    }
}

function stopFasting() {
    if (isRunning) {
        isRunning = false;
        clearInterval(timerInterval);
        startBtn.disabled = false;
    }
}

function updateTimer() {
    const currentTime = new Date().getTime();
    const elapsedTime = currentTime - startTime;
    
    const hours = Math.floor(elapsedTime / (1000 * 60 * 60));
    const minutes = Math.floor((elapsedTime % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((elapsedTime % (1000 * 60)) / 1000);
    
    timerDisplay.textContent = `${padNumber(hours)}:${padNumber(minutes)}:${padNumber(seconds)}`;
}

function padNumber(number) {
    return number.toString().padStart(2, '0');
}