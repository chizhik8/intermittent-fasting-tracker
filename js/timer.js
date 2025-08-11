const startTimeStorage = parseInt(localStorage.getItem('startTime')) || 0;
const elapsedTimeStorage = parseInt(localStorage.getItem('elapsedTime')) || 0;
const durationStorage = parseInt(localStorage.getItem('duration')) || 12;
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
    timeLefts.style.display = 'flex';
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
    window.location.reload();
    startBtn.disabled = false;
    duration.disabled = false;
    stopBtn.disabled = false;
    startDateInput.disabled = false;
    timeLefts.style.display = 'none';
    startDateInput.value = formatDateTime(Date.now());
    duration.value = 12;
};

const stages = [
    { name: "Blood sugar level rises", start: 0, end: 2 },
    { name: "Blood sugar level decreases", start: 2, end: 5 },
    { name: "Blood sugar level normalizes", start: 5, end: 9.5 },
    { name: "Fat burning begins (Ketosis)", start: 9.5, end: 15.5 },
    { name: "Fat burning intensifies", start: 15.5, end: 21.5 },
    { name: "Autophagy", start: 21.5, end: 33.5 },
    { name: "Hunger subsides", start: 33.5, end: 45.5 },
    { name: "Growth hormone boost", start: 45.5, end: 51.5 },
    { name: "Insulin level reduction", start: 51.5, end: 69.5 },
    { name: "Immune cell regeneration", start: 69.5, end: 141.5 }
];

const stageElements = document.querySelectorAll('#stages-section ul li');

const updateStages = (elapsedHours) => {
    stageElements.forEach((stageEl, index) => {
        const stage = stages[index];
        if (elapsedHours >= stage.end) {
            stageEl.className = 'stage-completed';
        } else if (elapsedHours >= stage.start && elapsedHours < stage.end) {
            stageEl.className = 'stage-in-progress';
        } else {
            stageEl.className = 'stage-not-started';
        }
    });
};

const updateTimer = () => {
    const startTime = parseInt(localStorage.getItem('startTime'));
    if (startTime <= Date.now()) {
        const elapsedTime = Date.now() - startTime;
        const elapsedHours = elapsedTime / (1000 * 60 * 60);
        const timeLeftMs = addHoursToDate(startTime) - Date.now();
        displayTime(elapsedTime);
        displayTimeLeft(timeLeftMs);
        updateStages(elapsedHours);

        if (timeLeftMs < 0) {
            timeLeftsMessage.textContent = 'keep it up!';
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
    const elapsedHours = elapsedTimeStorage / (1000 * 60 * 60);
    displayTime(elapsedTimeStorage);
    displayTimeLeft(timeLeftsStorage);
    updateStages(elapsedHours);
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
