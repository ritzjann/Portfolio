

const sections = document.querySelectorAll("section");
const navLinks = document.querySelectorAll(".nav-links a");

window.addEventListener("scroll", () => {

  let currentSection = "";

  sections.forEach((section) => {

    const sectionTop = section.offsetTop - 150;
    const sectionHeight = section.offsetHeight;

    if (
      window.scrollY >= sectionTop &&
      window.scrollY < sectionTop + sectionHeight
    ) {
      currentSection = section.getAttribute("id");
    }

  });


  navLinks.forEach((link) => {

    link.style.color = "#777";

    if (
      link.getAttribute("href") === `#${currentSection}`
    ) {
      link.style.color = "#111";
    }

  });

});