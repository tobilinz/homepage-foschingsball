countDown();

function countDown() {
    const days = document.getElementById("days");
    const hours = document.getElementById("hours");
    const minutes = document.getElementById("minutes");
    const seconds = document.getElementById("seconds");

    const date = Date.parse("2024-02-09T19:00:00.000+01:00");
    const now = Date.now();

    let diff = date - now;

    function updateCounter() {
        const daysLeft = diff / (1000 * 60 * 60 * 24);
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

    updateCounter()

    const countdownTimer = setInterval(function () {
        diff -= 1000;

        if (diff <= 0) {
            clearInterval(countdownTimer);
            days.textContent = "0";
            hours.textContent = "0";
            minutes.textContent = "0";
            seconds.textContent = "0";
            return;
        }

        updateCounter()
    }, 1000);
}