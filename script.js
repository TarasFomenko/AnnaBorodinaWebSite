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

const contactMessages = {
  ru: {
    subject: (name) => `Запрос на консультацию — ${name}`,
    checkingEmail: "Проверяем email…",
    sending: "Отправляем",
    success: "Спасибо! Ваш запрос отправлен.",
    error: "Не удалось отправить запрос. Попробуйте ещё раз или напишите на Ann.Nutrivibe@gmail.com.",
    nameRequired: "Введите ваше имя.",
    emailRequired: "Введите email.",
    emailInvalid: "Введите полный email, например name@gmail.com или name@company.com.",
    emailDomainInvalid: "Этот почтовый домен не существует или не принимает письма.",
    emailCheckFailed: "Не удалось проверить email. Проверьте соединение и попробуйте ещё раз.",
    messageRequired: "Кратко опишите ваш запрос.",
    copySuccess: "Email скопирован.",
    copyError: "Не удалось скопировать email."
  },
  en: {
    subject: (name) => `Consultation request — ${name}`,
    checkingEmail: "Checking email…",
    sending: "Sending",
    success: "Thank you! Your request has been sent.",
    error: "The request could not be sent. Please try again or email Ann.Nutrivibe@gmail.com.",
    nameRequired: "Please enter your name.",
    emailRequired: "Please enter your email.",
    emailInvalid: "Enter a complete email, for example name@gmail.com or name@company.com.",
    emailDomainInvalid: "This email domain does not exist or cannot receive mail.",
    emailCheckFailed: "The email could not be checked. Check your connection and try again.",
    messageRequired: "Please briefly describe your concern.",
    copySuccess: "Email copied.",
    copyError: "The email could not be copied."
  },
  uk: {
    subject: (name) => `Запит на консультацію — ${name}`,
    checkingEmail: "Перевіряємо email…",
    sending: "Надсилаємо",
    success: "Дякую! Ваш запит надіслано.",
    error: "Не вдалося надіслати запит. Спробуйте ще раз або напишіть на Ann.Nutrivibe@gmail.com.",
    nameRequired: "Введіть ваше ім’я.",
    emailRequired: "Введіть email.",
    emailInvalid: "Введіть повний email, наприклад name@gmail.com або name@company.com.",
    emailDomainInvalid: "Цей поштовий домен не існує або не приймає листи.",
    emailCheckFailed: "Не вдалося перевірити email. Перевірте з’єднання та спробуйте ще раз.",
    messageRequired: "Коротко опишіть ваш запит.",
    copySuccess: "Email скопійовано.",
    copyError: "Не вдалося скопіювати email."
  }
};

function getContactMessages(element) {
  const locale = element?.dataset.locale || contactForm?.dataset.locale || "ru";
  return contactMessages[locale] || contactMessages.ru;
}

function wait(milliseconds) {
  return new Promise((resolve) => window.setTimeout(resolve, milliseconds));
}

const submissionOverlay = document.querySelector("[data-submit-overlay]");
const overlayMessage = submissionOverlay?.querySelector("[data-overlay-message]");
const overlayDots = submissionOverlay?.querySelector("[data-overlay-dots]");
const lockablePageElements = document.querySelectorAll(
  "body > .site-header, body > main, body > .site-footer, body > .media-modal, body > .guide-modal"
);
let overlayDotsTimer = null;
let previouslyFocusedElement = null;

function setPageLocked(isLocked) {
  document.body.classList.toggle("form-submitting", isLocked);
  lockablePageElements.forEach((element) => {
    element.inert = isLocked;
  });
}

function showSendingOverlay(messages) {
  if (!submissionOverlay) {
    return;
  }

  previouslyFocusedElement = document.activeElement;
  submissionOverlay.hidden = false;
  submissionOverlay.setAttribute("aria-hidden", "false");
  submissionOverlay.classList.remove("is-success");
  overlayMessage.textContent = messages.sending;
  overlayDots.textContent = ".";
  setPageLocked(true);

  window.requestAnimationFrame(() => {
    submissionOverlay.classList.add("is-visible");
    submissionOverlay.focus({ preventScroll: true });
  });

  let dotCount = 1;
  window.clearInterval(overlayDotsTimer);
  overlayDotsTimer = window.setInterval(() => {
    dotCount = (dotCount % 3) + 1;
    overlayDots.textContent = ".".repeat(dotCount);
  }, 450);
}

function showSuccessOverlay(messages) {
  if (!submissionOverlay) {
    return;
  }

  window.clearInterval(overlayDotsTimer);
  overlayDots.textContent = "";
  overlayMessage.textContent = messages.success;
  submissionOverlay.classList.add("is-success");
}

async function hideSubmissionOverlay() {
  if (!submissionOverlay) {
    return;
  }

  window.clearInterval(overlayDotsTimer);
  submissionOverlay.classList.remove("is-visible");
  await wait(280);
  submissionOverlay.hidden = true;
  submissionOverlay.setAttribute("aria-hidden", "true");
  submissionOverlay.classList.remove("is-success");
  setPageLocked(false);

  if (previouslyFocusedElement instanceof HTMLElement) {
    previouslyFocusedElement.focus({ preventScroll: true });
  }
}

function isCompleteEmailAddress(value) {
  if (value.length > 254) {
    return false;
  }

  const parts = value.split("@");

  if (parts.length !== 2 || !parts[0] || parts[0].length > 64) {
    return false;
  }

  const domain = parts[1];
  const labels = domain.split(".");

  if (domain.length > 253 || labels.length < 2) {
    return false;
  }

  const hasValidLabels = labels.every((label) => (
    label.length > 0
    && label.length <= 63
    && /^[a-z0-9-]+$/i.test(label)
    && !label.startsWith("-")
    && !label.endsWith("-")
  ));

  if (!hasValidLabels) {
    return false;
  }

  const topLevelDomain = labels.at(-1);
  return /^[a-z]{2,63}$/i.test(topLevelDomain)
    || /^xn--[a-z0-9-]{2,59}$/i.test(topLevelDomain);
}

async function canEmailDomainReceiveMail(value) {
  const domain = value.slice(value.lastIndexOf("@") + 1).toLowerCase();
  const controller = new AbortController();
  const timeout = window.setTimeout(() => controller.abort(), 4500);

  try {
    const response = await fetch(
      `https://dns.google/resolve?name=${encodeURIComponent(domain)}&type=MX`,
      {
        headers: {
          Accept: "application/dns-json"
        },
        signal: controller.signal
      }
    );

    if (!response.ok) {
      throw new Error(`Email domain check returned ${response.status}`);
    }

    const result = await response.json();

    if (result.Status === 3) {
      return false;
    }

    if (result.Status !== 0) {
      throw new Error(`Email domain check returned DNS status ${result.Status}`);
    }

    return Array.isArray(result.Answer) && result.Answer.some((record) => (
      record.type === 15
      && typeof record.data === "string"
      && !/^\d+\s+\.$/.test(record.data.trim())
    ));
  } finally {
    window.clearTimeout(timeout);
  }
}

function setFieldError(field, error) {
  const errorElement = contactForm.querySelector(`[data-field-error="${field.name}"]`);
  field.setAttribute("aria-invalid", String(Boolean(error)));
  errorElement.textContent = error;
}

function getFieldError(field, messages) {
  const value = field.value.trim();

  if (!value) {
    if (field.name === "name") {
      return messages.nameRequired;
    }

    if (field.name === "email") {
      return messages.emailRequired;
    }

    return messages.messageRequired;
  }

  if (
    field.name === "email"
    && (field.validity.typeMismatch || !isCompleteEmailAddress(value))
  ) {
    return messages.emailInvalid;
  }

  return "";
}

function validateField(field, messages) {
  const error = getFieldError(field, messages);
  setFieldError(field, error);
  return !error;
}

function clearFieldErrors() {
  contactForm.querySelectorAll("[required]").forEach((field) => {
    field.removeAttribute("aria-invalid");
  });

  contactForm.querySelectorAll("[data-field-error]").forEach((errorElement) => {
    errorElement.textContent = "";
  });
}

if (contactForm && "fetch" in window) {
  const requiredFields = Array.from(contactForm.querySelectorAll("[required]"));
  contactForm.noValidate = true;

  requiredFields.forEach((field) => {
    field.addEventListener("input", () => {
      if (field.hasAttribute("aria-invalid")) {
        validateField(field, getContactMessages(contactForm));
      }
    });
  });

  contactForm.addEventListener("submit", async (event) => {
    event.preventDefault();

    const messages = getContactMessages(contactForm);
    let firstInvalidField = null;

    requiredFields.forEach((field) => {
      if (!validateField(field, messages) && !firstInvalidField) {
        firstInvalidField = field;
      }
    });

    if (firstInvalidField) {
      firstInvalidField.focus();
      return;
    }

    const submitButton = contactForm.querySelector("[data-submit-button]");
    const submitLabel = submitButton.querySelector("[data-submit-label]");
    const status = contactForm.querySelector("[data-form-status]");
    const emailField = contactForm.querySelector('[name="email"]');
    const originalSubmitLabel = submitLabel.textContent;

    submitButton.disabled = true;
    submitLabel.textContent = messages.checkingEmail;
    contactForm.setAttribute("aria-busy", "true");
    status.hidden = true;
    status.classList.remove("is-success", "is-error");

    try {
      const domainCanReceiveMail = await canEmailDomainReceiveMail(emailField.value.trim());

      if (!domainCanReceiveMail) {
        setFieldError(emailField, messages.emailDomainInvalid);
        emailField.focus();
        return;
      }
    } catch (error) {
      console.error("Email domain check failed", error);
      setFieldError(emailField, messages.emailCheckFailed);
      emailField.focus();
      return;
    } finally {
      submitButton.disabled = false;
      submitLabel.textContent = originalSubmitLabel;
      contactForm.removeAttribute("aria-busy");
    }

    const formData = new FormData(contactForm);
    const name = String(formData.get("name") || "").trim();
    const loadingStartedAt = window.performance.now();
    let submissionSucceeded = false;

    formData.set("subject", messages.subject(name));
    formData.set("page", window.location.href);
    submitButton.disabled = true;
    contactForm.setAttribute("aria-busy", "true");
    showSendingOverlay(messages);

    try {
      const response = await fetch(contactForm.action, {
        method: "POST",
        body: formData,
        headers: {
          Accept: "application/json"
        }
      });

      await wait(Math.max(0, 3000 - (window.performance.now() - loadingStartedAt)));

      if (!response.ok) {
        throw new Error(`Formspree returned ${response.status}`);
      }

      contactForm.reset();
      clearFieldErrors();
      showSuccessOverlay(messages);
      submissionSucceeded = true;
      await wait(2800);
    } catch (error) {
      await wait(Math.max(0, 3000 - (window.performance.now() - loadingStartedAt)));
      console.error("Contact form submission failed", error);
      status.textContent = messages.error;
      status.classList.add("is-error");
    } finally {
      await hideSubmissionOverlay();
      submitButton.disabled = false;
      contactForm.removeAttribute("aria-busy");

      if (!submissionSucceeded) {
        status.hidden = false;
      }
    }
  });
}

async function copyText(value) {
  if (navigator.clipboard && window.isSecureContext) {
    await navigator.clipboard.writeText(value);
    return;
  }

  const temporaryInput = document.createElement("textarea");
  temporaryInput.value = value;
  temporaryInput.setAttribute("readonly", "");
  temporaryInput.style.position = "fixed";
  temporaryInput.style.opacity = "0";
  document.body.appendChild(temporaryInput);
  temporaryInput.select();
  const copied = document.execCommand("copy");
  temporaryInput.remove();

  if (!copied) {
    throw new Error("Clipboard API is unavailable");
  }
}

document.querySelectorAll("[data-copy-email]").forEach((button) => {
  button.addEventListener("click", async () => {
    const messages = getContactMessages(button);
    const status = button.parentElement.querySelector("[data-copy-status]");

    try {
      await copyText(button.dataset.copyEmail);
      status.textContent = messages.copySuccess;
      status.classList.remove("is-error");
      status.classList.add("is-success");
    } catch (error) {
      console.error("Email copy failed", error);
      status.textContent = messages.copyError;
      status.classList.remove("is-success");
      status.classList.add("is-error");
    }

    status.hidden = false;
    window.setTimeout(() => {
      status.hidden = true;
      status.classList.remove("is-success", "is-error");
    }, 2500);
  });
});

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
