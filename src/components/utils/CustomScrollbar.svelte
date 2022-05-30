<script>
	/* PACKAGES */
	//import anime from 'animejs';

	import { createEventDispatcher } from 'svelte';

	/* STORES */

	import { innerWidth } from '@stores/layoutStore';

	/* PROPS */

	export let scrollArea;
	export let content;

	/* RUNTIME VARS */

	let initialized = false;
	let _event = {
		y: 0,
		deltaY: 0
	};

	const dispatch = createEventDispatcher();

	/* FUNCTIONS */
	function scroll() {
		const maxHeight = content.scrollHeight;
		// limit scroll top
		//_event.y = -content.scrollTop;
		if (_event.y + _event.deltaY > 0) {
			_event.y = 0;
			// limit scroll bottom
		} else if (-(_event.y + _event.deltaY) >= maxHeight) {
			_event.y = -maxHeight;
		} else {
			_event.y += _event.deltaY;
		}
	}

	const handleScroll = (event) => {
		//console.log('CHECKING EVENT TARGET', event);
		if ($innerWidth >= 768) {
			// console.log('not on mobile');

			event.stopImmediatePropagation();
			event.stopPropagation();
			event.preventDefault();

			_event.deltaY = event.wheelDeltaY || event.deltaY * 1;
			// reduce by half the delta amount otherwise it scroll too fast
			_event.deltaY *= 0.5;

			dispatch('scroll', true);

			setTimeout(() => {
				dispatch('scroll', false);
			}, 260);

			scroll();
		} else {
			/* event.stopImmediatePropagation();
			event.stopPropagation(); */
			return;
		}
	};

	/* REACTIVE STATEMENTS */

	$: {
		if (scrollArea && content && !initialized)
			scrollArea.addEventListener('wheel', handleScroll, { pasive: false });
	}

	$: {
		if (scrollArea && content) {
			//const contentHeight = content.getBoundingClientRect().height;

			/* const scrollHeightPercentage = (Number(content.scrollHeight) * 100) / Number(contentHeight); */

			/* anime({
				targets: content,
				scrollTop: -_event.y,
				duration: scrollHeightPercentage > 125 ? 250 : 50,
				easing: 'linear'
			}); */

			content.scroll({ left: 0, top: -_event.y });
			//if (content) content.scrollTop = -_event.y
			//console.log('CHECKING SCROLL', _event)
		}
	}
</script>
