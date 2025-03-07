const startTimeStorage = parseInt(localStorage.getItem('startTime')) || 0;
const elapsedTimeStorage = parseInt(localStorage.getItem('elapsedTime')) || 0;
const durationStorage = parseInt(localStorage.getItem('duration')) || 1;
const timeLeftsStorage = parseInt(localStorage.getItem('timeLeft')) || 0;

const timerDisplay = document.getElementById('timer');
const timeLefts = document.getElementById('time-left');
const timeLeftsMessage = document.getElementById('time-left-message');
const startBtn = document.getElementById('startBtn');
const stopBtn = document.getElementById('stopBtn');
const resetBtn = document.getElementById('resetBtn');
const duration = document.getElementById('duration');
const startDateInput = document.getElementById('start-date');
const endDateInput = document.getElementById('end-date');

let timerInterval;

const startFasting = () => {
    const startDate = new Date(startDateInput.value);
    if (!startTimeStorage) {
        localStorage.setItem('startTime', startDate.getTime());
    }
    localStorage.setItem('duration', duration.value);
    startBtn.disabled = true;
    duration.disabled = true;
    startDateInput.disabled = true;
    updateTimer();
    timerInterval = setInterval(updateTimer, 1000);
};

const stopFasting = () => {
    const startTime = parseInt(localStorage.getItem('startTime'));
    if (startTime) {
        localStorage.setItem("elapsedTime", Date.now() - startTime);
        localStorage.setItem("timeLeft", addHoursToDate(startTime) - Date.now());
        clearInterval(timerInterval);
        localStorage.removeItem('startTime');
        stopBtn.disabled = true;
    }
};

const resetFasting = () => {
    clearInterval(timerInterval);
    localStorage.clear();
    displayTime(0);
    displayTimeLeft(0);
    startBtn.disabled = false;
    duration.disabled = false;
    stopBtn.disabled = false;
    startDateInput.disabled = false;
    startDateInput.value = formatDateTime(Date.now());
    duration.value = 12;
};

const updateTimer = () => {
    const startTime = parseInt(localStorage.getItem('startTime'));
    if (startTime <= Date.now()) {
        const elapsedTime = Date.now() - startTime;
        const timeLeftMs = addHoursToDate(startTime) - Date.now();
        displayTime(elapsedTime);
        displayTimeLeft(timeLeftMs);

        if (timeLeftMs < 0) {
            timeLeftsMessage.textContent = 'above';
        }
    }
};

const setStartDateOrDuration = () => {
    const startDate = new Date(startDateInput.value);
    if (parseInt(duration.value) < 0) {
        duration.value = 0;
    }
    endDateInput.value = formatDateTime(addHoursToDate(startDate.getTime()));
}

const padNumber = (number) => number.toString().padStart(2, '0');

const displayTime = (ms) => {
    const hours = Math.floor(ms / (1000 * 60 * 60));
    const minutes = Math.floor((ms % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((ms % (1000 * 60)) / 1000);
    timerDisplay.textContent = `${padNumber(hours)}:${padNumber(minutes)}:${padNumber(seconds)}`;
};

const displayTimeLeft = (ms) => {
    const hours = Math.floor(ms / (1000 * 60 * 60)) < 0 ? Math.floor(ms / (1000 * 60 * 60))*-1 : Math.floor(ms / (1000 * 60 * 60));
    const minutes = Math.floor((ms % (1000 * 60 * 60)) / (1000 * 60)) < 0 ? Math.floor((ms % (1000 * 60 * 60)) / (1000 * 60))*-1 : Math.floor((ms % (1000 * 60 * 60)) / (1000 * 60));
    timeLefts.textContent = `${padNumber(hours)}:${padNumber(minutes)}`;
};

const formatDateTime = (timestamp) => {
    const date = new Date(timestamp);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    
    return `${year}-${month}-${day}T${hours}:${minutes}`;
};

const addHoursToDate = (timestamp) => {
    const date = new Date(timestamp);
    const hours = parseInt(duration.value) < 0 ? 0 : parseInt(duration.value);
    date.setHours(date.getHours() + hours);
    return date;
};

startBtn.addEventListener('click', startFasting);
stopBtn.addEventListener('click', stopFasting);
resetBtn.addEventListener('click', resetFasting);
startDateInput.addEventListener('change', setStartDateOrDuration);
duration.addEventListener('change', setStartDateOrDuration);

if (durationStorage) { 
    duration.value = durationStorage;
}

if (elapsedTimeStorage) {
    displayTime(elapsedTimeStorage);
    displayTimeLeft(timeLeftsStorage);
    startBtn.disabled = true;
    stopBtn.disabled = true;
    duration.disabled = true;
    startDateInput.disabled = true;
}

if (!startTimeStorage) {
    startDateInput.value = formatDateTime(Date.now());
    endDateInput.value = formatDateTime(addHoursToDate(Date.now()));
} else {
    startDateInput.value = formatDateTime(startTimeStorage);
    endDateInput.value = formatDateTime(addHoursToDate(startTimeStorage));
    startFasting();
}
