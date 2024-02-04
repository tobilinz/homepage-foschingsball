const date = Date.parse(`2024-02-09T19:00:00.000+01:00`);

const days = document.getElementById('days');
const hours = document.getElementById('hours');
const minutes = document.getElementById('minutes');
const seconds = document.getElementById('seconds');

function updateCounter() {
  const daysLeft = timeLeft / (1000 * 60 * 60 * 24);
  days.textContent = Math.floor(daysLeft).toString();
  const daysRest = daysLeft % 1;
  const hoursLeft = daysRest * 24;
  hours.textContent = Math.floor(hoursLeft).toString();
  const hoursRest = hoursLeft % 1;
  const minutesLeft = hoursRest * 60;
  minutes.textContent = Math.floor(minutesLeft).toString();
  const minutesRest = minutesLeft % 1;
  const secondsLeft = minutesRest * 60;
  seconds.textContent = Math.floor(secondsLeft).toString();
}

/* When too much time is left, the day count has three digits.
   This causes the day counter to overflow out of its border.
   When no time is left, the counter is useless.
*/
let timeLeft = date - Date.now();
const hundredDaysInMS = 100 * 24 * 60 * 60 * 1000;
if (!(timeLeft > hundredDaysInMS || timeLeft <= 0)) {
  updateCounter()
  const countdownTimer = setInterval(() => {
    timeLeft = date - Date.now();

    if (timeLeft <= 0) {
      clearInterval(countdownTimer);
      return;
    }

    updateCounter();
  }, 1000, {});
}
