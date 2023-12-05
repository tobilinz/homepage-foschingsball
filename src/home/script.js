const days = document.getElementById("days");
const hours = document.getElementById("hours");
const minutes = document.getElementById("minutes");
const seconds = document.getElementById("seconds");

const date = Date.parse("2024-02-09T19:00:00.000+01:00");
const now = Date.now();

let diff = date - now;

const daysLeft = diff / (1000 * 60 * 60 * 24);
days.textContent = Math.floor(daysLeft);
const daysRest = daysLeft % 1;
const hoursLeft = daysRest * 24;
hours.textContent = Math.floor(hoursLeft);
const hoursRest = hoursLeft % 1;
const minutesLeft = hoursRest * 60;
minutes.textContent = Math.floor(minutesLeft);
const minutesRest = minutesLeft % 1;
const secondsLeft = minutesRest * 60;
seconds.textContent = Math.floor(secondsLeft);

var countdownTimer = setInterval(function () {
  diff -= 1000;

  if (diff <= 0) {
    clearInterval(countdownTimer);
    return;
  }

  const daysLeft = diff / (1000 * 60 * 60 * 24);
  days.textContent = Math.floor(daysLeft);
  const daysRest = daysLeft % 1;
  const hoursLeft = daysRest * 24;
  hours.textContent = Math.floor(hoursLeft);
  const hoursRest = hoursLeft % 1;
  const minutesLeft = hoursRest * 60;
  minutes.textContent = Math.floor(minutesLeft);
  const minutesRest = minutesLeft % 1;
  const secondsLeft = minutesRest * 60;
  seconds.textContent = Math.floor(secondsLeft);
}, 1000);
