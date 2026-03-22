document.addEventListener("DOMContentLoaded", () => {
  // ==========================================
  // 1. SCROLL ANIMATIONS
  // ==========================================
  const elementsToReveal = document.querySelectorAll(".reveal-on-scroll");
  const scrollObserver = new IntersectionObserver(
    (entries, observer) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.15, rootMargin: "0px 0px -50px 0px" },
  );

  elementsToReveal.forEach((element) => scrollObserver.observe(element));

  // ==========================================
  // 2. CURSOR GLOW FIX
  // ==========================================
  const glow = document.querySelector(".cursor-glow");

  if (glow) {
    document.addEventListener("mousemove", (e) => {
      requestAnimationFrame(() => {
        glow.style.left = `${e.clientX}px`;
        glow.style.top = `${e.clientY}px`;
      });
    });
  } else {
    console.error("Cursor glow element not found in HTML.");
  }

  // ==========================================
  // 3. GEMINI API TRANSLATION DROPDOWN
  // ==========================================
  const langSelect = document.getElementById("lang-select");
  const CLOUDFLARE_WORKER_URL =
    "https://gemini-translator-api.idharanii.workers.dev/";

  if (langSelect) {
    // 1. Identify all elements we want to translate
    const elementsToTranslate = document.querySelectorAll(
      "h1, h2, h3, h4, p, .btn-primary, .btn-secondary",
    );

    // 2. CACHE THE ORIGINAL ENGLISH: Save a backup instantly on page load
    const originalEnglishText = Array.from(elementsToTranslate).map(
      (el) => el.innerText,
    );

    langSelect.addEventListener("change", async (e) => {
      const targetLang = e.target.value;

      // 3. INSTANT ENGLISH REVERT: If English is selected, restore from the cache and stop.
      if (targetLang === "en") {
        elementsToTranslate.forEach((el, index) => {
          el.innerText = originalEnglishText[index];
        });
        return;
      }

      document.body.style.opacity = "0.5";
      document.body.style.cursor = "wait";

      try {
        // 4. ALWAYS TRANSLATE FROM ENGLISH: We pass 'originalEnglishText' to the API
        // so we never accidentally translate Spanish directly to Tamil.
        const response = await fetch(CLOUDFLARE_WORKER_URL, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            targetLanguage: targetLang,
            textToTranslate: JSON.stringify(originalEnglishText),
          }),
        });

        if (!response.ok) throw new Error("Backend connection failed");

        const data = await response.json();

        if (data.error) throw new Error(data.error);

        // 5. Parse the new JSON object format
        const translatedData = JSON.parse(data.translation);
        const translatedArray = translatedData.translations;

        // 6. Update the DOM
        elementsToTranslate.forEach((el, index) => {
          if (translatedArray && translatedArray[index]) {
            el.innerText = translatedArray[index];
          }
        });
      } catch (error) {
        console.error("Translation error:", error);
        alert("Translation failed: " + error.message);
      } finally {
        document.body.style.opacity = "1";
        document.body.style.cursor = "default";
      }
    });
  }

  // ==========================================
  // 4. DEV TOOLS & RIGHT-CLICK PROTECTION
  // ==========================================

  // Check the URL for the '?showDev=true' parameter
  const urlParams = new URLSearchParams(window.location.search);
  const isDevMode = urlParams.get("showDev") === "true";

  // Only apply the restrictions if Dev Mode is NOT active
  if (!isDevMode) {
    // Disables context menu (right-click)
    document.addEventListener("contextmenu", (e) => e.preventDefault());

    // Disables F12, Ctrl+Shift+I/J/C, Ctrl+U, Ctrl+S
    document.onkeydown = (e) => {
      if (
        e.keyCode === 123 || // F12
        (e.ctrlKey &&
          e.shiftKey &&
          (e.keyCode === 73 || e.keyCode === 74 || e.keyCode === 67)) || // Ctrl+Shift+I/J/C
        (e.ctrlKey && (e.keyCode === 85 || e.keyCode === 83)) // Ctrl+U / Ctrl+S
      ) {
        e.preventDefault();
        return false;
      }
    };

    console.log("SYS_STATUS: Security protocols active. Dev tools locked.");
  } else {
    console.log("SYS_STATUS: Dev mode unlocked. Welcome back.");
  }

  // ==========================================
  // 5. HAMBURGER MENU & NAVIGATION
  // ==========================================
  const menuBtn = document.getElementById("menu-btn");
  const navLinks = document.getElementById("nav-links");
  const navItems = document.querySelectorAll(".nav-links a");

  if (menuBtn && navLinks) {
    // Toggle the menu open/closed
    menuBtn.addEventListener("click", () => {
      menuBtn.classList.toggle("active");
      navLinks.classList.toggle("active");
    });

    // Close the menu automatically when a link is clicked
    navItems.forEach((item) => {
      item.addEventListener("click", () => {
        menuBtn.classList.remove("active");
        navLinks.classList.remove("active");
      });
    });
  }

  // ==========================================
  // 6. PHOTOGRAPHY LIGHTBOX
  // ==========================================
  const lightbox = document.getElementById("lightbox");
  const lightboxImg = document.getElementById("lightbox-img");
  const lightboxClose = document.getElementById("lightbox-close");
  // Target the images directly inside the photo frames
  const photoFrames = document.querySelectorAll(".photo-frame img");

  if (lightbox && photoFrames.length > 0) {
    // 1. Open Lightbox
    photoFrames.forEach((img) => {
      img.addEventListener("click", () => {
        lightboxImg.src = img.src; // Copy the clicked image's source
        lightbox.classList.add("active");
        document.body.style.overflow = "hidden"; // Lock background scrolling
      });
    });

    // 2. Core Close Function
    const closeLightbox = () => {
      lightbox.classList.remove("active");
      document.body.style.overflow = "auto"; // Unlock background scrolling

      // Clear the image source after the fade-out animation completes
      setTimeout(() => {
        lightboxImg.src = "";
      }, 400);
    };

    // 3. Close via the 'X' button
    lightboxClose.addEventListener("click", closeLightbox);

    // 4. Close by clicking anywhere in the dark background
    lightbox.addEventListener("click", (e) => {
      // Ensure we didn't click on the image itself
      if (e.target === lightbox) {
        closeLightbox();
      }
    });

    // 5. Close via the 'Escape' key for desktop power users
    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape" && lightbox.classList.contains("active")) {
        closeLightbox();
      }
    });
  }
});
