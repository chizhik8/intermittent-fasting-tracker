const startTimeStorage = parseInt(localStorage.getItem('startTime')) || 0;
const elapsedTimeStorage = parseInt(localStorage.getItem('elapsedTime')) || 0;

const timerDisplay = document.getElementById('timer');
const startBtn = document.getElementById('startBtn');
const stopBtn = document.getElementById('stopBtn');
const resetBtn = document.getElementById('resetBtn');

let timerInterval;

const startFasting = () => {
    if (!startTimeStorage) {
        localStorage.setItem('startTime', Date.now());
    }
    startBtn.disabled = true;
    updateTimer();
    timerInterval = setInterval(updateTimer, 1000);
};

const stopFasting = () => {
    localStorage.setItem("elapsedTime", Date.now() - parseInt(localStorage.getItem('startTime')));
    clearInterval(timerInterval);
    localStorage.removeItem('startTime');
    stopBtn.disabled = true;
};

const resetFasting = () => {
    clearInterval(timerInterval);
    localStorage.clear();
    displayTime(0);
    startBtn.disabled = false;
    stopBtn.disabled = false;
};

const updateTimer = () => {
    displayTime(Date.now() - parseInt(localStorage.getItem('startTime')));
};

const displayTime = (ms) => {
    const hours = Math.floor(ms / (1000 * 60 * 60));
    const minutes = Math.floor((ms % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((ms % (1000 * 60)) / 1000);
    timerDisplay.textContent = `${padNumber(hours)}:${padNumber(minutes)}:${padNumber(seconds)}`;
};

const padNumber = (number) => number.toString().padStart(2, '0');

startBtn.addEventListener('click', startFasting);
stopBtn.addEventListener('click', stopFasting);
resetBtn.addEventListener('click', resetFasting);

if (elapsedTimeStorage) {
    displayTime(elapsedTimeStorage);
    startBtn.disabled = true;
    stopBtn.disabled = true;
}

if (startTimeStorage) {
    startFasting();
}
