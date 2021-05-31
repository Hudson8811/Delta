document.addEventListener("DOMContentLoaded", function () {
	const audioPlayer = () => {
		const headerAudioBtn = document.querySelector(".header__button");
		const footerAudioBtn = document.querySelector(".footer__button");

		MUSIC_URL = "audio/audio.mp3";
		const audio = new Audio(MUSIC_URL);
		audio.autoplay = true;
		document.head.append(audio);
		const toggleAudio = () => {
			if (!audio.paused) {
				audio.pause();
				audio.paused = true;
			} else {
				audio.play();
				audio.paused = false;
			}
		};

		headerAudioBtn.addEventListener("click", toggleAudio);
		footerAudioBtn.addEventListener("click", toggleAudio);
	};

	// audioPlayer();

	const switchHomeImages = () => {
		const buttonsWrapper = document.querySelector(".home-content__icons");
		const backgroundImages = document.querySelectorAll(".overlay>img");

		if (!buttonsWrapper) return;

		let isHovered = false;

		buttonsWrapper.addEventListener("mouseover", (event) => {
			if (!isHovered) {
				let target = event.target;

				target = target.closest(".home-content__icons-item");

				if (target) {
					isHovered = true;
					backgroundImages.forEach((image, index) => {
						image.className = +target.dataset.item === index ? "active" : "";
					});

					target.addEventListener("mouseleave", () => {
						isHovered = false;
					});
				}
			}
		});
	};

	switchHomeImages();

	const nextSlide = tickSlide();
	const timer = startTimer();

	const startGame = () => {
		let livesCount = 3;

		document.body.classList.add("game-is-on");

		document.addEventListener("change", (e) => {
			console.log(e);
			let target = e.target;

			if (target.value === "fail" && livesCount > 0) {
				const invalidBlock = target.closest(".game__form-question");

				livesCount--;
				livesDecrease(livesCount);
				showError(invalidBlock);
			}

			if (livesCount === 0) {
				gameover("losing");
			}

			if (target.value === "correct") {
				hideError();
				nextSlide();
			}
		});
	};

	function startTimer() {
		const timer = document.getElementById("timer");
		const base = "60";

		let d = "00";
		let h = "00";
		let min = "00";
		let sec = "00";

		const tick = () => {
			sec++;

			if (sec < "10") {
				sec = "0" + sec;
			}

			if (sec === +base) {
				sec = "00";
				min++;
				if (min < "10") {
					min = "0" + min;
				}
			}

			if (min === base) {
				min = "00";
				h++;
				if (h < "10") {
					h = "0" + h;
				}
			}

			if (h === "24") {
				h = "00";
				d++;
				if (d < "10") {
					d = "0" + d;
				}
			}

			timer.textContent = `${d}:${h}:${min}:${sec}`;
		};

		const timerInterval = setInterval(tick, 1000);

		return timerInterval;
	}

	function stopTimer() {
		clearInterval(timer);
	}

	function gameover(status) {
		const gameSection = document.querySelector(".game");
		const winTitle = `Вы спасли всех! На всякий случай скачайте памятку с советами по безопасности и повторите основные правила`;
		const loseTitle = `Вы повержены! Изучите памятку безопасности и пройдите игру снова`;

		gameSection.classList.add("game--finished");

		gameSection.querySelector(".game__result-title").textContent =
			status === "win" ? winTitle : loseTitle;

		stopTimer();
	}

	function livesDecrease(livesCount) {
		const livesMobileIcons = document.querySelector(".game__lives");
		const livesDesktopIcons = document.querySelector(".footer__lives");

		const livesMobile = livesMobileIcons.querySelectorAll("img");
		const livesDesktop = livesDesktopIcons.querySelectorAll("img");

		const ICON_SRC = "img/heart.svg";

		livesMobile[livesCount].src = ICON_SRC;
		livesDesktop[livesCount].src = ICON_SRC;
	}

	function showError(currentInvalidBlock) {
		hideError();

		currentInvalidBlock.classList.add("invalid");
	}

	function hideError() {
		const invalidBlock = document.querySelector(".invalid");

		if (invalidBlock) {
			invalidBlock.classList.remove("invalid");
		}
	}

	function tickSlide() {
		const slides = document.querySelectorAll(".game__slide");
		const slidesCount = slides.length;

		let currentSlide = 1;

		return () => {
			if (currentSlide === slidesCount) {
				gameover("win");
				return;
			}
			currentSlide++;
			const activeSlide = document.querySelector(".active-slide");
			activeSlide.classList.remove("active-slide");
			slides[currentSlide - 1].classList.add("active-slide");
			setSlidesCounter(currentSlide, slidesCount);
		};
	}

	function setSlidesCounter(currentSlide, slidesCount) {
		const curSlide = document.querySelector(".game__slide-current");
		const totalSlides = document.querySelector(".game__slide-count");

		curSlide.textContent = currentSlide;
		totalSlides.textContent = slidesCount;
	}

	const isGamePage = () => {
		const regExp = /game/g;
		return regExp.test(window.location.pathname);
	};

	if (isGamePage()) {
		startGame();
	}
});
