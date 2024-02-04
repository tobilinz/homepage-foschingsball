function processEntry(entry, observer) {
  if (!entry.isIntersecting) return;

  const iframe = document.createElement('iframe');
  iframe.src = entry.target.dataset.src;
  iframe.allowFullscreen = true;
  iframe.referrerPolicy = 'no-referrer-when-downgrade';
  iframe.title = entry.target.dataset.title;

  entry.target.appendChild(iframe);
  observer.unobserve(entry.target);
}

const observer = new IntersectionObserver(
  (entries, observer) => entries.forEach(
    entry => processEntry(entry, observer)
  )
);

Array.from(document.getElementsByClassName('lazy-map')).forEach(element => observer.observe(element));