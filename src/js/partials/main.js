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

	audioPlayer();

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

	if (isGamePage()) {
		let nextSlide = tickSlide();
		let timer = startTimer();

		let allowNext = false;

		function startGame() {
			let livesCount = 3;

			document.body.classList.add("game-is-on");

			document.addEventListener("change", (e) => {
				let target = e.target;

				if (target.value === "fail" && livesCount > 0) {
					const invalidBlock = target.closest(".game__form-question");
					livesCount--;
					livesDecrease(livesCount);
					showError(invalidBlock);
					allowNext = true;
					activeBtn(target);
				}

				if (livesCount === 0) {
					gameover("losing");
				}

				if (target.value === "correct") {
					hideError();
					allowNext = true;
					activeBtn(target);
				}
			});

			document.addEventListener("click", (e) => {
				let target = e.target;
				if(target && target.id== 'brnNext'){
					if (allowNext) {
						nextSlide();
						document.querySelectorAll(".game__form-btn").forEach(e => e.parentNode.removeChild(e));
						allowNext = false;
					}
				}
			});

			document.addEventListener("click", (e) => {
				let target = e.target;
				if(target && target.id== 'reinitTest'){
					document.getElementById("timer").textContent = '00:00:00:00';
					timer = startTimer();
					const gameSection = document.querySelector(".game");
					gameSection.classList.remove("game--finished","game--lose");
					gameSection.style.cssText = "";

					const livesMobileIcons = document.querySelector(".game__lives");
					const livesDesktopIcons = document.querySelector(".footer__lives");
					const livesMobile = livesMobileIcons.querySelectorAll(".game__lives-heart .filled");
					const livesDesktop = livesDesktopIcons.querySelectorAll(".game__lives-heart .filled");
					livesMobile.forEach(e => e.style.cssText = "");
					livesDesktop.forEach(e => e.style.cssText = "");

					livesCount = 3;
					allowNext = false;
					document.querySelectorAll(".game__form-btn").forEach(e => e.parentNode.removeChild(e));
					document.querySelectorAll('.game__form').forEach(e => e.classList.remove("with-btn"));
					document.querySelectorAll(".game__form input").forEach(e => e.disabled = false);
					document.querySelectorAll(".game__form-question").forEach(e => e.classList.remove("invalid"));
					document.querySelectorAll("input:checked").forEach(e => e.checked = false);
					document.querySelectorAll(".active-slide").forEach(e => e.classList.remove("active-slide"));
					document.querySelectorAll(".game__slide")[0].classList.add('active-slide');
					document.querySelector(".game__slide-current").textContent = '1';
					nextSlide = tickSlide();
				}
			});
		}

		function activeBtn(elem){
			let form = elem.closest('.game__form');
			form.classList.add("with-btn");
			let inputs = form.querySelectorAll("input");
			inputs.forEach((input) => { input.disabled = true; });
			let btnHtml = '<button class="game__form-btn" type="button" id="brnNext">Далее</button>';
			form.insertAdjacentHTML('beforeend', btnHtml);
		}



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
			if (status !== "win") {
				gameSection.style.cssText = "transition: background-color 1s ease;";
				gameSection.classList.add("game--lose");
			}
			stopTimer();
		}

		function livesDecrease(livesCount) {
			const livesMobileIcons = document.querySelector(".game__lives");
			const livesDesktopIcons = document.querySelector(".footer__lives");

			const livesMobile = livesMobileIcons.querySelectorAll(".game__lives-heart .filled");
			const livesDesktop = livesDesktopIcons.querySelectorAll(".game__lives-heart .filled");


			livesMobile[livesCount].style.cssText = "color: #d52032; transform: scale(2);";
			livesDesktop[livesCount].style.cssText = "color: #d52032; transform: scale(2);";

			setTimeout(function (){
				livesMobile[livesCount].style.cssText = "color: black; transform: scale(0);";
				livesDesktop[livesCount].style.cssText = "color: black; transform: scale(0);";
			},500);
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
				console.log(currentSlide);
				setSlidesCounter(currentSlide, slidesCount);
			};
		}

		function setSlidesCounter(currentSlide, slidesCount) {
			const curSlide = document.querySelector(".game__slide-current");
			const totalSlides = document.querySelector(".game__slide-count");

			curSlide.textContent = currentSlide;
			totalSlides.textContent = slidesCount;
		}
	}

	function isGamePage() {
		const regExp = /game/g;
		return regExp.test(window.location.pathname);
	}

	if (isGamePage()) {
		startGame();
	}
});
