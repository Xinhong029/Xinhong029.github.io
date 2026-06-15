const sections = [...document.querySelectorAll("header[id], section[id]")];
const controls = [...document.querySelectorAll(".control")];
const sectionLinks = [...document.querySelectorAll('a[href^="#"]')];
const scrollDuration = 1800;

const easeInOutCubic = (progress) =>
  progress < 0.5
    ? 4 * progress * progress * progress
    : 1 - Math.pow(-2 * progress + 2, 3) / 2;

const scrollToSection = (target, duration = scrollDuration) => {
  const start = window.scrollY;
  const end = target.getBoundingClientRect().top + window.scrollY;
  const distance = end - start;
  const startTime = performance.now();

  return new Promise((resolve) => {
    const step = (time) => {
      const elapsed = time - startTime;
      const progress = Math.min(elapsed / duration, 1);
      window.scrollTo(0, start + distance * easeInOutCubic(progress));

      if (progress < 1) {
        requestAnimationFrame(step);
        return;
      }

      resolve();
    };

    requestAnimationFrame(step);
  });
};

const setActiveControl = () => {
  const midpoint = window.scrollY + window.innerHeight * 0.35;
  let activeId = sections[0].id;

  for (const section of sections) {
    if (section.offsetTop <= midpoint) {
      activeId = section.id;
    }
  }

  controls.forEach((control) => {
    control.classList.toggle(
      "active-btn",
      control.getAttribute("href") === `#${activeId}`,
    );
  });
};

setActiveControl();
window.addEventListener("scroll", setActiveControl, { passive: true });

sectionLinks.forEach((link) => {
  link.addEventListener("click", (event) => {
    const href = link.getAttribute("href");
    if (!href || href === "#") return;

    const target = document.querySelector(href);
    if (!target) return;

    event.preventDefault();

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      target.scrollIntoView();
      history.pushState(null, "", href);
      return;
    }

    scrollToSection(target).then(() => {
      history.pushState(null, "", href);
    });
  });
});
