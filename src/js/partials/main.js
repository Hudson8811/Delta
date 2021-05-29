document.addEventListener('DOMContentLoaded', function() {

	const switchHomeImages = () => {
		const buttonsWrapper = document.querySelector('.home-content__icons');
		const backgroundImages = document.querySelectorAll('.overlay>img');
		
		if (!buttonsWrapper) return;

		let isHovered = false;

		buttonsWrapper.addEventListener('mouseover', event => {
			if (!isHovered) {
				let target = event.target;

				target = target.closest('.home-content__icons-item');
	
				if (target) {
					isHovered = true;
					backgroundImages.forEach((image, index) => {
						image.className = +target.dataset.item === index ? 'active' : '';
					});

					target.addEventListener('mouseleave', () => {
						isHovered = false;
					});
				}
			}
		});
	}

	switchHomeImages();

	const startGame = () => {
		document.body.classList.add('game-is-on');
	}

	const isGamePage = () => {
		const regExp = /game/g;
		return regExp.test(window.location.pathname);
	}

	if (isGamePage()) {
		startGame(); 
	}





});