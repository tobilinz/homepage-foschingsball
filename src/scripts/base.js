setVersion('1.9.1');
blur(0.5);

function setVersion(version) {
  document.getElementById('version').textContent = 'Version: ' + version;
}

function blur(entryMultiplier) {
  const background = document.getElementById('background');

  function blur() {
    if (window.scrollY > window.innerHeight * entryMultiplier) background.classList.add('blur');
    else background.classList.remove('blur');
  }

  blur();
  window.addEventListener('scroll', blur, {passive: true});
}
