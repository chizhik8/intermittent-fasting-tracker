const calendar = document.getElementById('calendar');
const MONTHS = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December'
];

function openDB() {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open('fastingTracker', 1);
    request.onupgradeneeded = function(event) {
      const db = event.target.result;
      db.createObjectStore('days', { keyPath: 'date' });
    };
    request.onsuccess = function(event) {
      resolve(event.target.result);
    };
    request.onerror = function(event) {
      reject(event);
    };
  });
}

function saveFastingDay(date, duration) {
  openDB().then(db => {
    const tx = db.transaction('days', 'readwrite');
    const store = tx.objectStore('days');
    store.put({ date, duration });
  });
}

function getFastingDay(date) {
  return openDB().then(db => {
    return new Promise(resolve => {
      const tx = db.transaction('days', 'readonly');
      const store = tx.objectStore('days');
      const req = store.get(date);
      req.onsuccess = () => resolve(req.result ? req.result.duration : '');
      req.onerror = () => resolve('');
    });
  });
}

function renderCalendar(year, month) {
  const monthName = MONTHS[month];
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  document.getElementById("calendar-header").textContent = `${monthName} ${year}`;
  const calendarBody = document.getElementById("calendar-body");
  calendarBody.innerHTML = "";
  let row = document.createElement('tr');
  let firstDay = new Date(year, month, 1).getDay();
  firstDay = firstDay === 0 ? 6 : firstDay - 1;
  for (let i = 0; i < firstDay; i++) {
    row.appendChild(document.createElement('td'));
  }
  for (let day = 1; day <= daysInMonth; day++) {
    const td = document.createElement('td');
    const dateStr = `${year}-${String(month+1).padStart(2,'0')}-${String(day).padStart(2,'0')}`;
    getFastingDay(dateStr).then(duration => {
        td.innerHTML = `<div class='calendar-day'>${day}</div><input class='calendar-input' type='text' pattern='^([0-9]{1,2})$' value='${duration}' />`;
      td.querySelector('input').addEventListener('change', e => {
        saveFastingDay(dateStr, e.target.value);
      });
      td.classList.add('calendar-cell');
    });
    row.appendChild(td);
    if ((firstDay + day) % 7 === 0 || day === daysInMonth) {
      calendarBody.appendChild(row);
      row = document.createElement('tr');
    }
  }
}

const today = new Date();
renderCalendar(today.getFullYear(), today.getMonth());
document.getElementById('prevMonth').onclick = () => {
  let year = today.getFullYear();
  let month = today.getMonth() - 1;
  if (month < 0) { month = 11; year--; }
  renderCalendar(year, month);
};
document.getElementById('nextMonth').onclick = () => {
  let year = today.getFullYear();
  let month = today.getMonth() + 1;
  if (month > 11) { month = 0; year++; }
  renderCalendar(year, month);
};
