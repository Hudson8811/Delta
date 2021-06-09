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
		let timer = startTimer();
		let allowNext = false;

		function startGame() {
			let nextSlide = tickSlide();
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
					const correctBlock = target.closest(".game__form-question");
					showError(correctBlock);
					//hideError();
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

		function generateGame(testType = ''){
			if (testType){
				let jsonUrl = '';
				switch (testType){
					case "car":
						jsonUrl = 'questions/car.json';
						break;
					case "house":
						jsonUrl = 'questions/house.json';
						break;
					case "values":
						jsonUrl = 'questions/values.json';
						break;
				}

				document.querySelectorAll(".game__slide").forEach(e => e.parentNode.removeChild(e));

				getJSON(jsonUrl,function(err, data) {
					if (err !== null) {S
						console.log('Something went wrong: ' + err);
					} else {
						let slide = 0;
						let answerIndex = 0;
						let $outHtml = '';
						Object.entries(data.test).forEach(entry => {
							slide ++;
							const [key, value] = entry;
							let quest = value['question'],
								img = value['img'],
								answers = value['answers'];
							if (slide === 1){
								$outHtml += '<div class="game__slide game__slide'+slide+' active-slide">\n';
							} else {
								$outHtml += '<div class="game__slide game__slide'+slide+'">\n';
							}

							$outHtml += '<div class="game__slide-img"><img src="'+img+'" alt=""></div>\n' +
								'<div class="game__slide-content"> \n' +
								'<p class="game__slide-title">'+quest+'</p>\n' +
								'<form class="game__form" action="#"> \n';

							const randomly = () => Math.random() - 0.5;
							const randomAnswers = Array(answers.length).fill({});
							const dynamicAnswers = [].concat(answers).sort(randomly);
							randomAnswers.forEach((t, i) => {
								let answer = dynamicAnswers[i];
								answerIndex++;
								let answerText = answer.text,
									answerTip = answer.tip,
									answerValid = answer.valid,
									answerValidStatus = 'fail',
									answerValidText = 'Ошибка';
								if (answerValid){
									answerValidStatus = 'correct';
									answerValidText = 'Верно';
								}

								$outHtml +=	'<div class="game__form-question">\n' +
									'<input class="game__form-input" type="radio" id="car-question'+answerIndex+'" name="slide1" value="'+answerValidStatus+'">\n' +
									'<label class="game__form-label" for="car-question'+answerIndex+'">'+answerText+'</label>\n' +
									'<div class="game__form-question-error"><span>'+answerValidText+'! </span><span>'+answerTip+'</span></div>\n' +
									'</div>\n';
							});

							$outHtml +=	'</form>\n' +
								'</div>\n' +
								'</div>';
						});

						document.querySelector(".game").insertAdjacentHTML('afterbegin', $outHtml);
						startGame();
					}
				});


			}
		}

		function activeBtn(elem){
			let form = elem.closest('.game__form');
			form.classList.add("with-btn");
			let inputs = form.querySelectorAll("input");
			inputs.forEach((input) => { input.disabled = true; });
			let btnHtml = '<button class="game__form-btn" type="button" id="brnNext">Далее</button>';
			form.insertAdjacentHTML('beforeend', btnHtml);

			let newBtn = document.querySelector('.game__form-btn');
			let box = elem.closest('.game__slide-content');
			scrollToElm( box, newBtn , 0.5 );
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
			let testType = gameSection.getAttribute('data-type');
			let winTitle = `Вы спасли всех! На всякий случай изучите памятку с советами по безопасности от <a href="https://www.delta.ru" target="_blank">Delta</a> и Woman.ru и повторите основные правила`;
			let loseTitle = `Вы повержены! Изучите памятку безопасности и пройдите игру снова`;

			switch (testType) {
				case 'car':
					loseTitle = 'Вы повержены! Изучите памятку для автоледи от <a href="https://www.delta.ru" target="_blank">Delta</a> и Woman.ru и пройдите игру снова';
					break;
				case 'house':
					loseTitle = 'Вы повержены! Изучите памятку для защиты недвижимого имущества от <a href="https://www.delta.ru" target="_blank">Delta</a> и Woman.ru и пройдите игру снова';
					break;
				case 'values':
					loseTitle = 'Вы повержены! Изучите памятку <a href="https://www.delta.ru" target="_blank">Delta</a> и Woman.ru для защиты особенно ценных предметов и наличных средств и пройдите игру снова';
					break;
			}

			gameSection.classList.add("game--finished");

			gameSection.querySelector(".game__result-title").innerHTML =
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
		let testType = document.querySelector(".game").getAttribute('data-type');
		generateGame(testType);
	}
});

window.addEventListener('load', (event) => {
	let homeIcons = document.querySelector('.home-content__icon');
	if (homeIcons){
		if (!isElementInViewport(homeIcons)){
			addScrollDownArrow();
		}
	}
});

function isElementInViewport (el) {
	if (typeof jQuery === "function" && el instanceof jQuery) {
		el = el[0];
	}
	var rect = el.getBoundingClientRect();
	return (
		rect.top >= 0 &&
		rect.left >= 0 &&
		rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) && /* or $(window).height() */
		rect.right <= (window.innerWidth || document.documentElement.clientWidth) /* or $(window).width() */
	);
}

function addScrollDownArrow () {
	let container = document.querySelector('.home-content__container');
	let arrowHtml = '<div class="home-content__arrow"><img src="img/arrow-down.svg" alt=""></div>';
	container.insertAdjacentHTML('beforeend', arrowHtml);
	window.addEventListener('scroll', function(e) {
		document.querySelector('.home-content__arrow').classList.add("hide");
	});
}

var getJSON = function(url, callback) {
	var xhr = new XMLHttpRequest();
	xhr.open('GET', url, true);
	xhr.responseType = 'json';
	xhr.onload = function() {
		var status = xhr.status;
		if (status === 200) {
			callback(null, xhr.response);
		} else {
			callback(status, xhr.response);
		}
	};
	xhr.send();
};


function scrollToElm(container, elm, duration = 1){
	var pos = getRelativePos(elm);
	scrollTo( container, pos.top , duration);
}

function getRelativePos(elm){
	var pPos = elm.parentNode.getBoundingClientRect(),
		cPos = elm.getBoundingClientRect(),
		pos = {};

	pos.top    = cPos.top    - pPos.top + elm.parentNode.scrollTop,
		pos.right  = cPos.right  - pPos.right,
		pos.bottom = cPos.bottom - pPos.bottom,
		pos.left   = cPos.left   - pPos.left;

	return pos;
}

function scrollTo(element, to, duration, onDone) {
	var start = element.scrollTop,
		change = to - start,
		startTime = performance.now(),
		val, now, elapsed, t;

	function animateScroll(){
		now = performance.now();
		elapsed = (now - startTime)/1000;
		t = (elapsed/duration);

		element.scrollTop = start + change * easeInOutQuad(t);

		if( t < 1 )
			window.requestAnimationFrame(animateScroll);
		else
			onDone && onDone();
	};

	animateScroll();
}

function easeInOutQuad(t){ return t<.5 ? 2*t*t : -1+(4-2*t)*t };