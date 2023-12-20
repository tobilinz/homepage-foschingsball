countDown()
blinking()

function countDown() {
    const days = document.getElementById('days');
    const hours = document.getElementById('hours');
    const minutes = document.getElementById('minutes');
    const seconds = document.getElementById('seconds');

    const date = Date.parse("2024-02-09T19:00:00.000+01:00");

    function updateCounter() {
        const timeLeft = date - Date.now();

        if (timeLeft <= 0) return false;

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

        return true;
    }

    if (!updateCounter()) return;

    const countdownTimer = setInterval(() => {
        if (updateCounter()) return;

        clearInterval(countdownTimer);
        days.textContent = "0";
        hours.textContent = "0";
        minutes.textContent = "0";
        seconds.textContent = "0";
    }, 1000);
}

function blinking() {
    const frames = document.getElementsByClassName('counter-frame');
    const filter = getComputedStyle(document.documentElement).getPropertyValue('--glow');
    
    function blink() {
        const rand = Math.floor(Math.random() * frames.length);
        const frame = frames[rand];

        frame.style.filter = "none";
        setInterval(() => frame.style.filter = filter, Math.random() * 200 + 100);
    }

    setInterval(blink, Math.random() * 1000 + 1000)
}