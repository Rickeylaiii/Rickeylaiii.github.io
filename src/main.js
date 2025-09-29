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

    const videoCards = document.querySelectorAll(".video-card");
    let activeVideo = null;

    const updateButtonState = (card, state) => {
        const ctaButton = card.querySelector(".video-card__cta");
        const playButton = card.querySelector(".video-card__play");
        const labelMap = {
            idle: "播放视频",
            playing: "暂停播放",
            paused: "继续播放",
            ended: "重新播放",
        };

        if (ctaButton) {
            const nextLabel = labelMap[state] ?? labelMap.idle;
            ctaButton.textContent = nextLabel;
            ctaButton.dataset.state = state;
        }

        if (playButton) {
            const baseLabel = playButton.dataset.labelPlay || playButton.getAttribute("aria-label") || labelMap.idle;
            const nextLabel = state === "idle" ? baseLabel : labelMap[state] ?? baseLabel;
            playButton.setAttribute("aria-label", nextLabel);
        }
    };

    const stopActiveVideo = () => {
        if (!activeVideo) {
            return;
        }

        const card = activeVideo.closest(".video-card");
        if (card) {
            const playerContainer = card.querySelector(".video-card__player");
            if (playerContainer) {
                playerContainer.hidden = true;
            }
            card.classList.remove("video-card--active");
        }

        activeVideo.pause();
        activeVideo.currentTime = 0;
        if (card) {
            updateButtonState(card, "idle");
        }
        activeVideo = null;
    };

    const bindVideoEvents = (card, videoEl) => {
        if (videoEl.dataset.eventsBound === "true") {
            return;
        }

        videoEl.addEventListener("playing", () => {
            card.classList.add("video-card--active");
            const playerContainer = card.querySelector(".video-card__player");
            if (playerContainer) {
                playerContainer.hidden = false;
            }
            updateButtonState(card, "playing");
            activeVideo = videoEl;
        });

        videoEl.addEventListener("pause", () => {
            if (videoEl.ended) {
                return;
            }

            const playerContainer = card.querySelector(".video-card__player");
            if (playerContainer && playerContainer.hidden) {
                updateButtonState(card, "idle");
                card.classList.remove("video-card--active");
            } else if (videoEl.currentTime > 0) {
                updateButtonState(card, "paused");
            } else {
                updateButtonState(card, "idle");
                card.classList.remove("video-card--active");
            }
        });

        videoEl.addEventListener("ended", () => {
            const playerContainer = card.querySelector(".video-card__player");
            if (playerContainer) {
                playerContainer.hidden = true;
            }
            card.classList.remove("video-card--active");
            updateButtonState(card, "ended");
            if (activeVideo === videoEl) {
                activeVideo = null;
            }
        });

        videoEl.dataset.eventsBound = "true";
    };

    const toggleVideoForCard = (card) => {
        const src = card.dataset.src;
        if (!src) {
            return;
        }

        const playerContainer = card.querySelector(".video-card__player");
        if (!playerContainer) {
            return;
        }

        let videoEl = playerContainer.querySelector("video");

        if (activeVideo && activeVideo !== videoEl) {
            stopActiveVideo();
        }

        if (!videoEl) {
            videoEl = document.createElement("video");
            videoEl.controls = true;
            videoEl.preload = "metadata";
            videoEl.playsInline = true;
            videoEl.setAttribute("webkit-playsinline", "");

            const poster = card.dataset.poster;
            if (poster) {
                videoEl.poster = poster;
            }

            const sourceEl = document.createElement("source");
            sourceEl.src = src;
            const lowerSrc = src.trim().toLowerCase();
            sourceEl.type = lowerSrc.endsWith(".webm") ? "video/webm" : "video/mp4";
            videoEl.appendChild(sourceEl);

            playerContainer.appendChild(videoEl);
            bindVideoEvents(card, videoEl);
        }

        if (playerContainer.hidden) {
            playerContainer.hidden = false;
        }

        if (videoEl.paused) {
            const playAttempt = videoEl.play();
            if (playAttempt && typeof playAttempt.catch === "function") {
                playAttempt.catch(() => {
                    updateButtonState(card, "paused");
                });
            }
            card.classList.add("video-card--active");
            activeVideo = videoEl;
        } else {
            videoEl.pause();
            card.classList.remove("video-card--active");
        }
    };

    videoCards.forEach((card) => {
        const playButton = card.querySelector(".video-card__play");
        const ctaButton = card.querySelector(".video-card__cta");

        if (playButton && !playButton.dataset.labelPlay) {
            playButton.dataset.labelPlay = playButton.getAttribute("aria-label") || "播放视频";
        }

        if (ctaButton && !ctaButton.dataset.state) {
            ctaButton.dataset.state = "idle";
        }

        const handleToggle = (event) => {
            event.preventDefault();
            toggleVideoForCard(card);
        };

        playButton?.addEventListener("click", handleToggle);
        ctaButton?.addEventListener("click", handleToggle);
    });
});
