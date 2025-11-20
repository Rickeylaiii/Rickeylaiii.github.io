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

    // 点击特效
    document.addEventListener('click', (e) => {
        const ripple = document.createElement('div');
        ripple.className = 'click-ripple';
        
        // 设置位置
        ripple.style.left = `${e.pageX}px`;
        ripple.style.top = `${e.pageY}px`;
        
        document.body.appendChild(ripple);
        
        // 动画结束后移除元素
        ripple.addEventListener('animationend', () => {
            ripple.remove();
        });
    });
});
