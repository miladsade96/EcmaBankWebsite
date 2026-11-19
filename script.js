"use strict";

const nav = document.querySelector(".nav");
const menuButton = document.querySelector(".nav__toggle");
const navigation = document.querySelector(".nav__links");
const mobileLayout = window.matchMedia("(max-width: 50em)");

function closeMenu(restoreFocus = false) {
  nav.classList.remove("nav--open");
  menuButton.setAttribute("aria-expanded", "false");
  menuButton.setAttribute("aria-label", "Open navigation");
  if (restoreFocus && mobileLayout.matches) menuButton.focus();
}

menuButton.addEventListener("click", () => {
  const open = menuButton.getAttribute("aria-expanded") !== "true";
  nav.classList.toggle("nav--open", open);
  menuButton.setAttribute("aria-expanded", String(open));
  menuButton.setAttribute("aria-label", open ? "Close navigation" : "Open navigation");
});
navigation.addEventListener("click", (event) => {
  if (event.target.closest("a")) closeMenu();
});
document.addEventListener("click", (event) => {
  if (!nav.contains(event.target)) closeMenu();
});
document.addEventListener("keydown", (event) => {
  if (event.key === "Escape" && nav.classList.contains("nav--open")) {
    closeMenu(true);
  }
});
mobileLayout.addEventListener("change", () => {
  const focusInLinks = navigation.contains(document.activeElement);
  const focusOnButton = document.activeElement === menuButton;
  closeMenu(focusInLinks);
  if (!mobileLayout.matches && focusOnButton) navigation.querySelector("a").focus();
});

// Native dialogs handle background inertness, Escape and focus containment.
const modal = document.querySelector(".modal");
const form = document.querySelector(".modal__form");
const formStatus = document.querySelector(".modal__status");
const accountForm = initNetlifyForm(form, formStatus, {
  successMessage: "Thanks! Your account information request has been sent.",
});
let modalTrigger;

document.querySelectorAll(".btn--show-modal").forEach((button) => {
  button.addEventListener("click", () => {
    closeMenu();
    modalTrigger = button;
    modal.showModal();
    document.body.classList.add("modal-open");
  });
});
document.querySelector(".btn--close-modal").addEventListener("click", () => modal.close());
modal.addEventListener("click", (event) => {
  if (event.target !== modal) return;
  const rect = modal.getBoundingClientRect();
  if (event.clientX < rect.left || event.clientX > rect.right || event.clientY < rect.top || event.clientY > rect.bottom) modal.close();
});
modal.addEventListener("keydown", (event) => {
  if (event.key !== "Tab") return;
  const controls = [...modal.querySelectorAll("button, input")].filter((control) => !control.disabled && control.type !== "hidden" && !control.closest("[hidden]"));
  const first = controls[0];
  const last = controls[controls.length - 1];
  if (event.shiftKey && document.activeElement === first) {
    event.preventDefault();
    last.focus();
  } else if (!event.shiftKey && document.activeElement === last) {
    event.preventDefault();
    first.focus();
  }
});
modal.addEventListener("close", () => {
  document.body.classList.remove("modal-open");
  if (form.getAttribute("aria-busy") !== "true") {
    form.reset();
    accountForm.resetFeedback();
  }
  const focusTarget = mobileLayout.matches && navigation.contains(modalTrigger) ? menuButton : modalTrigger;
  focusTarget?.focus();
});
// Roving tabindex and arrow keys keep tabs usable without a mouse.
const tabsContainer = document.querySelector(".operations__tab-container");
const tabs = [...tabsContainer.querySelectorAll('[role="tab"]')];
const panels = [...document.querySelectorAll('[role="tabpanel"]')];
function activateTab(tab, moveFocus = false) {
  tabs.forEach((item) => {
    const active = item === tab;
    item.classList.toggle("operations__tab--active", active);
    item.setAttribute("aria-selected", String(active));
    item.tabIndex = active ? 0 : -1;
  });
  panels.forEach((panel) => {
    const active = panel.id === tab.getAttribute("aria-controls");
    panel.hidden = !active;
    panel.classList.toggle("operations__content--active", active);
  });
  if (moveFocus) tab.focus();
}
tabsContainer.addEventListener("click", (event) => {
  const tab = event.target.closest('[role="tab"]');
  if (tab) activateTab(tab);
});
tabsContainer.addEventListener("keydown", (event) => {
  const index = tabs.indexOf(event.target);
  if (index < 0) return;
  let next;
  if (event.key === "ArrowRight") next = (index + 1) % tabs.length;
  if (event.key === "ArrowLeft") next = (index - 1 + tabs.length) % tabs.length;
  if (event.key === "Home") next = 0;
  if (event.key === "End") next = tabs.length - 1;
  if (next === undefined) return;
  event.preventDefault();
  activateTab(tabs[next], true);
});

// Process every observer entry, including sections revealed simultaneously.
const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
if ("IntersectionObserver" in window && !reducedMotion.matches) {
  const sectionObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      entry.target.classList.remove("section--hidden");
      observer.unobserve(entry.target);
    });
  }, { threshold: 0, rootMargin: "0px 0px -32px 0px" });
  document.querySelectorAll(".section").forEach((section) => {
    section.classList.add("section--hidden");
    sectionObserver.observe(section);
  });
}

const slider = document.querySelector(".slider");
const slides = [...slider.querySelectorAll(".slide")];
const dotContainer = slider.querySelector(".dots");
const sliderStatus = slider.querySelector(".slider__status");
let currentSlide = 0;
const dots = slides.map((_, index) => {
  const dot = document.createElement("button");
  dot.type = "button";
  dot.className = "dots__dot";
  dot.setAttribute("aria-label", `Show testimonial ${index + 1}`);
  dot.addEventListener("click", () => goToSlide(index));
  dotContainer.appendChild(dot);
  return dot;
});
function goToSlide(index, announce = true) {
  currentSlide = (index + slides.length) % slides.length;
  slides.forEach((slide, i) => {
    const active = i === currentSlide;
    slide.style.transform = `translateX(${100 * (i - currentSlide)}%)`;
    slide.setAttribute("aria-hidden", String(!active));
    slide.inert = !active;
    dots[i].classList.toggle("dots__dot--active", active);
    if (active) dots[i].setAttribute("aria-current", "true");
    else dots[i].removeAttribute("aria-current");
  });
  if (announce) sliderStatus.textContent = `Testimonial ${currentSlide + 1} of ${slides.length}`;
}
slider.querySelector(".slider__btn--left").addEventListener("click", () => goToSlide(currentSlide - 1));
slider.querySelector(".slider__btn--right").addEventListener("click", () => goToSlide(currentSlide + 1));
slider.addEventListener("keydown", (event) => {
  if (event.key === "ArrowLeft" || event.key === "ArrowRight") {
    event.preventDefault();
    goToSlide(currentSlide + (event.key === "ArrowRight" ? 1 : -1));
  }
});
goToSlide(0, false);
