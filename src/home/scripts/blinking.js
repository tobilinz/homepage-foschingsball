const minInterval = 2000;
const intervalRange = 4000;
const minBlinkTimes = 1;
const blinkTimesRange = 3;
const minOnOffDelay = 75;
const onOffDelayRange = 25;
const classNames = [
  'counter-frame'
]

const elements = []
for (const className of classNames) {
  const classElements = document.getElementsByClassName(className);
  for (const classElement of classElements) elements.push(classElement);
}

const filter = getComputedStyle(document.documentElement).getPropertyValue('--glow');
const shadow = getComputedStyle(document.documentElement).getPropertyValue('--shadow');

function blink() {
  const element = elements[Math.floor(Math.random() * elements.length)];
  const amount = Math.floor(Math.random() * blinkTimesRange + minBlinkTimes);

  let totalDelay = 0;
  for (let i = 0; i < amount; i++) {
    setTimeout(() => element.style.setProperty('filter', shadow), totalDelay);

    totalDelay += Math.random() * onOffDelayRange + minOnOffDelay;
    setTimeout(() => element.style.setProperty('filter', filter), totalDelay);

    totalDelay += Math.random() * onOffDelayRange + minOnOffDelay;
  }

  setTimeout(blink, Math.random() * intervalRange + minInterval)
}

blink();