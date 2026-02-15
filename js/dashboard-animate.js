const counters = document.querySelectorAll("[data-count]");

counters.forEach(counter => {
  const target = +counter.dataset.count;
  let count = 0;

  const update = () => {
    const inc = Math.ceil(target / 60);
    count += inc;

    if (count < target) {
      counter.innerText = count;
      requestAnimationFrame(update);
    } else {
      counter.innerText = target;
    }
  };

  update();
});
