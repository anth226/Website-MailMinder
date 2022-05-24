<script>
	import Hoverable from '../utils/Hoverable.svelte';
	import MediaQuery from '../utils/MediaQuery.svelte';
	import { clickOutside } from '../utils/clickOutside.js';

	let showWhatIsIt = false;

	const toggleWhatIsIt = (bool) => {
		if (bool === undefined) {
			showWhatIsIt = !showWhatIsIt;
		} else {
			showWhatIsIt = bool;
		}
	};
</script>

<!-- Mobile::What is it -->
<MediaQuery query="(max-width: 576px)" let:matches>
	{#if matches}
		<div class="header__info info-mobile">
			<label for="infoCheck" class="info__label">What is it?</label>
			<input id="infoCheck" on:click={toggleWhatIsIt} />
			<div
				class="header__popup popup-mobile"
				class:active={showWhatIsIt}
				use:clickOutside
				on:click_outside={() => toggleWhatIsIt(false)}
			>
				<div
					id="popupCloseMobile"
					class="header__popup-close"
					on:click={() => toggleWhatIsIt(false)}
				>
					<span />
					<span />
				</div>
				<span class="info__label">What is it?</span>
				<p>
					Email reminders made simple. Send yourself a email reminder for Mom’s birthday, dentist
					appointment, or anything you want.
				</p>
				<a href="https://petrovdigital.io/" target="_blank"
					>Created by:<br />
					<span>
						<picture>
							<source srcset="img/petrov.svg" type="image/webp" />
							<img src="img/petrov.svg" alt="Created by logo" />
						</picture>
					</span>
				</a>
			</div>
		</div>
	{:else}
		<!-- Desktop::What is it -->
		<Hoverable let:hovering={active}>
			<div class="header__info info-mobile">
				<!-- <div class="header__info" on:click={toggleWhatIsIt}> -->
				<!-- <span for="infoCheck" class="info__label">What is it?</span>
                <input id="infoCheck"/> -->

				<label for="infoCheck" class="info__label">What is it?</label>
				<input id="infoCheck" />

				<!-- <div class="header__popup active"> -->

				<div class="header__popup" class:active>
					<!-- <div id="popupCloseMobile" class="header__popup-close">
                  <span />
                  <span />
                </div> -->

					<span class="info__label">What is it?</span>
					<p>
						Email reminders made simple. Send yourself a email reminder for Mom’s birthday, dentist
						appointment, or anything you want.
					</p>
					<a href="https://petrovdigital.io/" target="_blank"
						>Created by:<br />
						<span>
							<picture>
								<source srcset="img/petrov.svg" type="image/webp" />
								<img src="img/petrov.svg" alt="Created by logo" />
							</picture>
						</span>
					</a>
				</div>
			</div>
		</Hoverable>
	{/if}
</MediaQuery>
