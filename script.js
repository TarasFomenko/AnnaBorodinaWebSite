const header = document.getElementById("siteHeader");
const menuButton = document.getElementById("menuButton");
const mainNav = document.getElementById("mainNav");
const contactForm = document.getElementById("contactForm");

function onScroll() {
  if (window.scrollY > 40) {
    header.classList.add("scrolled");
  } else {
    header.classList.remove("scrolled");
  }
}

window.addEventListener("scroll", onScroll);
onScroll();

menuButton.addEventListener("click", () => {
  const isOpen = mainNav.classList.toggle("open");
  menuButton.classList.toggle("active", isOpen);
  menuButton.setAttribute("aria-expanded", String(isOpen));
  document.body.classList.toggle("menu-open", isOpen);
});

mainNav.querySelectorAll("a").forEach((link) => {
  link.addEventListener("click", () => {
    mainNav.classList.remove("open");
    menuButton.classList.remove("active");
    menuButton.setAttribute("aria-expanded", "false");
    document.body.classList.remove("menu-open");
  });
});

const reducedMotionQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
const staggerGroups = document.querySelectorAll(
  ".principles-grid, .scope-grid, .service-cards, .guides-grid, .topic-list, .testimonial-grid, .certificate-preview-grid"
);

staggerGroups.forEach((group) => {
  Array.from(group.children).forEach((item, index) => {
    item.classList.add("reveal");
    item.style.setProperty("--reveal-delay", `${Math.min(index * 80, 360)}ms`);
  });
});

const revealElements = document.querySelectorAll(".reveal");

function showRevealElements() {
  revealElements.forEach((element) => element.classList.add("visible"));
}

if (reducedMotionQuery.matches || !("IntersectionObserver" in window)) {
  showRevealElements();
} else {
  const revealObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("visible");
          revealObserver.unobserve(entry.target);
        }
      });
    },
    {
      threshold: 0.14,
      rootMargin: "0px 0px -70px 0px",
    }
  );

  revealElements.forEach((element) => revealObserver.observe(element));
}

if (reducedMotionQuery.addEventListener) {
  reducedMotionQuery.addEventListener("change", (event) => {
    if (event.matches) {
      showRevealElements();
    }
  });
}

const accordionItems = document.querySelectorAll(".accordion-item");

function closeAccordionItem(item) {
  const button = item.querySelector("button");
  const content = item.querySelector(".accordion-content");

  item.classList.remove("active");
  button.setAttribute("aria-expanded", "false");
  content.style.maxHeight = `${content.scrollHeight}px`;

  window.requestAnimationFrame(() => {
    content.style.maxHeight = null;
  });
}

function openAccordionItem(item) {
  const button = item.querySelector("button");
  const content = item.querySelector(".accordion-content");

  item.classList.add("active");
  button.setAttribute("aria-expanded", "true");
  content.style.maxHeight = `${content.scrollHeight}px`;
}

accordionItems.forEach((item) => {
  const button = item.querySelector("button");
  button.setAttribute("aria-expanded", "false");

  button.addEventListener("click", () => {
    const isActive = item.classList.contains("active");

    accordionItems.forEach((activeItem) => {
      if (activeItem.classList.contains("active")) {
        closeAccordionItem(activeItem);
      }
    });

    if (!isActive) {
      openAccordionItem(item);
    }
  });
});

window.addEventListener("resize", () => {
  accordionItems.forEach((item) => {
    if (item.classList.contains("active")) {
      const content = item.querySelector(".accordion-content");
      content.style.maxHeight = `${content.scrollHeight}px`;
    }
  });
});

if (contactForm) {
  contactForm.addEventListener("submit", (event) => {
    event.preventDefault();

    const formData = new FormData(contactForm);
    const name = formData.get("name");
    const email = formData.get("email");
    const message = formData.get("message");
    const locale = contactForm.dataset.locale || "ru";

    const labels = {
      ru: {
        subject: `Запрос на консультацию — ${name}`,
        body: `Имя: ${name}\nEmail: ${email}\n\nЗапрос:\n${message}`
      },
      en: {
        subject: `Consultation request — ${name}`,
        body: `Name: ${name}\nEmail: ${email}\n\nMessage:\n${message}`
      },
      uk: {
        subject: `Запит на консультацію — ${name}`,
        body: `Ім’я: ${name}\nEmail: ${email}\n\nЗапит:\n${message}`
      }
    };

    const current = labels[locale] || labels.ru;
    const subject = encodeURIComponent(current.subject);
    const body = encodeURIComponent(current.body);

    window.location.href = `mailto:Ann.Nutrivibe@gmail.com?subject=${subject}&body=${body}`;
  });
}

const mediaGalleryModal = document.getElementById("mediaGalleryModal");
const gallerySources = new Map();

document.querySelectorAll("[data-gallery-group-source]").forEach((source) => {
  const group = source.dataset.galleryGroupSource;
  const count = Number.parseInt(source.dataset.galleryCount || "0", 10);
  const folder = (source.dataset.galleryFolder || "").replace(/\/$/, "");
  const prefix = source.dataset.galleryPrefix || "image";
  const extension = source.dataset.galleryExtension || "jpg";
  const altPrefix = source.dataset.galleryAltPrefix || source.dataset.galleryTitle || "Image";

  if (!group || !count || !folder) {
    return;
  }

  const images = Array.from({ length: count }, (_, index) => {
    const number = String(index + 1).padStart(2, "0");

    return {
      src: `${folder}/${prefix}-${number}.${extension}`,
      alt: `${altPrefix} ${index + 1}`,
    };
  });

  gallerySources.set(group, {
    title: source.dataset.galleryTitle || "",
    counterLabel: source.dataset.galleryCounterLabel || "",
    images,
  });
});

if (mediaGalleryModal && gallerySources.size) {
  const galleryButtons = document.querySelectorAll("[data-gallery-open]");
  const galleryTitle = mediaGalleryModal.querySelector("[data-gallery-title]");
  const galleryCounter = mediaGalleryModal.querySelector("[data-gallery-counter]");
  const galleryImage = mediaGalleryModal.querySelector("[data-gallery-image]");
  const galleryClose = mediaGalleryModal.querySelector("[data-gallery-close]");
  const galleryPrevious = mediaGalleryModal.querySelector("[data-gallery-prev]");
  const galleryNext = mediaGalleryModal.querySelector("[data-gallery-next]");
  let activeGallery = null;
  let activeIndex = 0;
  let lastActiveGalleryElement = null;
  let galleryCloseTimer = null;

  const updateGalleryImage = () => {
    if (!activeGallery || !activeGallery.images.length) {
      return;
    }

    const image = activeGallery.images[activeIndex];
    galleryTitle.textContent = activeGallery.title;
    galleryCounter.textContent = `${activeGallery.counterLabel} ${activeIndex + 1} / ${activeGallery.images.length}`;
    galleryImage.src = image.src;
    galleryImage.alt = image.alt;
  };

  const showGalleryImage = (direction) => {
    if (!activeGallery || !activeGallery.images.length) {
      return;
    }

    const total = activeGallery.images.length;
    activeIndex = (activeIndex + direction + total) % total;
    updateGalleryImage();
  };

  const openMediaGallery = (button) => {
    const group = button.dataset.galleryOpen;
    const gallery = gallerySources.get(group);

    if (!gallery) {
      return;
    }

    const startIndex = Number.parseInt(button.dataset.galleryStart || "0", 10);
    lastActiveGalleryElement = document.activeElement;
    activeGallery = gallery;
    activeIndex = Math.min(Math.max(startIndex, 0), gallery.images.length - 1);

    if (galleryCloseTimer) {
      window.clearTimeout(galleryCloseTimer);
    }

    updateGalleryImage();
    mediaGalleryModal.hidden = false;
    mediaGalleryModal.setAttribute("aria-hidden", "false");
    document.body.classList.add("modal-open");

    window.requestAnimationFrame(() => {
      mediaGalleryModal.classList.add("open");
      galleryClose.focus();
    });
  };

  const closeMediaGallery = () => {
    mediaGalleryModal.classList.remove("open");
    mediaGalleryModal.setAttribute("aria-hidden", "true");
    document.body.classList.remove("modal-open");

    galleryCloseTimer = window.setTimeout(() => {
      mediaGalleryModal.hidden = true;
      galleryImage.removeAttribute("src");

      if (lastActiveGalleryElement) {
        lastActiveGalleryElement.focus();
      }
    }, 220);
  };

  galleryButtons.forEach((button) => {
    button.addEventListener("click", () => openMediaGallery(button));
  });

  galleryClose.addEventListener("click", closeMediaGallery);
  galleryPrevious.addEventListener("click", () => showGalleryImage(-1));
  galleryNext.addEventListener("click", () => showGalleryImage(1));

  mediaGalleryModal.addEventListener("click", (event) => {
    if (event.target === mediaGalleryModal) {
      closeMediaGallery();
    }
  });

  document.addEventListener("keydown", (event) => {
    if (mediaGalleryModal.hidden) {
      return;
    }

    if (event.key === "Escape") {
      closeMediaGallery();
    }

    if (event.key === "ArrowLeft") {
      showGalleryImage(-1);
    }

    if (event.key === "ArrowRight") {
      showGalleryImage(1);
    }
  });
}

const guideModal = document.getElementById("guideModal");
const guideModalButtons = document.querySelectorAll("[data-guide-modal]");

if (guideModal && guideModalButtons.length) {
  const guideModalTitle = guideModal.querySelector("[data-guide-title]");
  const guideModalPrice = guideModal.querySelector("[data-guide-price]");
  const guideModalPageOne = guideModal.querySelector("[data-guide-page-one]");
  const guideModalPageTwo = guideModal.querySelector("[data-guide-page-two]");
  const guideModalCheckout = guideModal.querySelector("[data-guide-checkout]");
  const guideModalClose = guideModal.querySelector("[data-guide-close]");
  let lastActiveElement = null;
  let closeTimer = null;

  const openGuideModal = (button) => {
    lastActiveElement = document.activeElement;

    guideModalTitle.textContent = button.dataset.title || "";
    guideModalPrice.textContent = button.dataset.price || "";
    guideModalPageOne.textContent = button.dataset.pageOne || "";
    guideModalPageTwo.textContent = button.dataset.pageTwo || "";
    guideModalCheckout.href = button.dataset.checkoutUrl || "#";

    if (closeTimer) {
      window.clearTimeout(closeTimer);
    }

    guideModal.hidden = false;
    guideModal.setAttribute("aria-hidden", "false");
    document.body.classList.add("modal-open");

    window.requestAnimationFrame(() => {
      guideModal.classList.add("open");
      guideModalClose.focus();
    });
  };

  const closeGuideModal = () => {
    guideModal.classList.remove("open");
    guideModal.setAttribute("aria-hidden", "true");
    document.body.classList.remove("modal-open");

    closeTimer = window.setTimeout(() => {
      guideModal.hidden = true;
      if (lastActiveElement) {
        lastActiveElement.focus();
      }
    }, 220);
  };

  guideModalButtons.forEach((button) => {
    button.addEventListener("click", () => openGuideModal(button));
  });

  guideModalClose.addEventListener("click", closeGuideModal);

  guideModal.addEventListener("click", (event) => {
    if (event.target === guideModal) {
      closeGuideModal();
    }
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && !guideModal.hidden) {
      closeGuideModal();
    }
  });
}
