document.addEventListener("DOMContentLoaded", () => {
    const yearEl = document.getElementById("year");
    if (yearEl) {
        yearEl.textContent = new Date().getFullYear();
    }

    const heroCta = document.querySelector(".hero__cta");
    if (heroCta) {
        heroCta.addEventListener("click", (event) => {
            const targetId = heroCta.getAttribute("href");
            if (!targetId || !targetId.startsWith("#")) {
                return;
            }

            const target = document.querySelector(targetId);
            if (target) {
                event.preventDefault();
                target.scrollIntoView({ behavior: "smooth", block: "start" });
            }
        });
    }

});
