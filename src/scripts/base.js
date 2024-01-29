//setBackgroundImage();
setVersion('1.6.0');
blur(0.5);

function setBackgroundImage() {
  const portrait = document.getElementById('portrait');
  const landscape = document.getElementById('landscape');

  const displayOrientation = () => {
    const screenOrientation = screen.orientation.type;
    if (screenOrientation === 'landscape-primary' || screenOrientation === 'landscape-secondary') {
      landscape.classList.remove('hidden');
      portrait.classList.add('hidden')
    } else if (screenOrientation === 'portrait-secondary' || screenOrientation === 'portrait-primary') {
      portrait.classList.remove('hidden');
      landscape.classList.add('hidden');
    }
  };

  try {
    window.screen.orientation.onchange = displayOrientation;
    displayOrientation();
  } catch (e) {
  }
}

function setVersion(version) {
  document.getElementById('version').textContent = 'Version: ' + version;
}

function blur(entryMultiplier) {
  let hasBlurred = false;
  const backgrounds = document.getElementsByClassName('background');

  function blur() {
    if (window.scrollY > window.innerHeight * entryMultiplier) {
      backgrounds[0].classList.remove('blur-out');
      backgrounds[1].classList.remove('blur-out');
      backgrounds[0].classList.add('blur-in');
      backgrounds[1].classList.add('blur-in');
      hasBlurred = true;
    } else if (hasBlurred) {
      backgrounds[0].classList.remove('blur-in');
      backgrounds[1].classList.remove('blur-in');
      backgrounds[0].classList.add('blur-out');
      backgrounds[1].classList.add('blur-out');
    }
  }

  blur();
  window.addEventListener('scroll', blur, {passive: true});
}