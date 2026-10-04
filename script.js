// 1. Grab the elements we need
const sections = document.querySelectorAll("section");
const navLinks = document.querySelectorAll(".nav-links a");

// 2. Reveal sections as they scroll into view
const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      entry.target.classList.add("visible");
    }
  });
}, { threshold: 0.15 }); // fires when 15% of the section is visible

sections.forEach((section) => revealObserver.observe(section));

// 3. Highlight the nav link of the section you're currently reading
const activeObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      navLinks.forEach((link) => {
        link.classList.toggle(
          "active",
          link.getAttribute("href") === "#" + entry.target.id
        );
      });
    }
  });
}, { threshold: 0.5 });

sections.forEach((section) => activeObserver.observe(section));

// 4. Open project details in a native dialog
const projectDialog = document.querySelector("#project-dialog");
const projectTitle = document.querySelector("#project-dialog-title");
const projectDescription = document.querySelector("#project-dialog-description");
const projectGallery = document.querySelector("#project-gallery");

document.querySelectorAll(".project-trigger").forEach((trigger) => {
  trigger.addEventListener("click", () => {
    const title = trigger.dataset.title;
    const imagePaths = (trigger.dataset.images || "")
      .split(",")
      .map((path) => path.trim())
      .filter(Boolean);

    projectTitle.textContent = title;
    projectDescription.textContent = trigger.dataset.description;
    projectGallery.replaceChildren();

    if (imagePaths.length === 0) {
      const placeholder = document.createElement("div");
      placeholder.className = "project-photo-placeholder";
      placeholder.textContent = "No project photos added yet.";
      projectGallery.append(placeholder);
    }

    imagePaths.forEach((path, index) => {
      const image = document.createElement("img");
      image.src = path;
      image.alt = `${title} project photo ${index + 1}`;
      image.addEventListener("error", () => {
        const placeholder = document.createElement("div");
        placeholder.className = "project-photo-placeholder";
        placeholder.textContent = `Add a photo at ${path}`;
        image.replaceWith(placeholder);
      }, { once: true });
      projectGallery.append(image);
    });

    projectDialog.showModal();
  });
});

document.querySelector(".project-dialog-close").addEventListener("click", () => {
  projectDialog.close();
});

projectDialog.addEventListener("click", (event) => {
  if (event.target === projectDialog) {
    projectDialog.close();
  }
});