const revealItems = document.querySelectorAll(".reveal");
const carousel = document.querySelector("[data-carousel]");
const prevButton = document.querySelector("[data-carousel-prev]");
const nextButton = document.querySelector("[data-carousel-next]");
const copyableAddresses = document.querySelectorAll(".copyable-address");

const observer = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("is-visible");
        observer.unobserve(entry.target);
      }
    });
  },
  {
    threshold: 0.16,
  }
);

revealItems.forEach((item) => observer.observe(item));

if (carousel && prevButton && nextButton) {
  const scrollByCard = (direction) => {
    const card = carousel.querySelector(".video-card");
    if (!card) return;

    const gap = parseFloat(getComputedStyle(carousel).columnGap || getComputedStyle(carousel).gap || "0") || 0;
    const amount = card.getBoundingClientRect().width + gap;

    carousel.scrollBy({
      left: direction * amount,
      behavior: "smooth",
    });
  };

  prevButton.addEventListener("click", () => scrollByCard(-1));
  nextButton.addEventListener("click", () => scrollByCard(1));
}

copyableAddresses.forEach((address) => {
  address.addEventListener("click", async (event) => {
    event.preventDefault();
    event.stopPropagation();

    const value = address.dataset.copyValue || address.textContent.trim();
    const selection = window.getSelection();
    const range = document.createRange();

    range.selectNodeContents(address);
    selection.removeAllRanges();
    selection.addRange(range);

    try {
      await navigator.clipboard.writeText(value);
    } catch {
      // Selection still lets the user copy manually if clipboard access is blocked.
    }
  });

  address.addEventListener("keydown", async (event) => {
    if (event.key !== "Enter" && event.key !== " ") return;
    event.preventDefault();
    address.click();
  });
});
