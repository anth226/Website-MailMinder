<script>
	export let title;
	export let show = false;

	const toggleShow = () => {
		show = !show;
	};
</script>

{#if show}
	<div class="page-popup schedule-popup active" on:click={toggleShow}>
		<div class="schedule-popup__content">
			<div class="schedule-popup__img">
				<div class="schedule-popup__tick">
					<picture>
						<source srcset="img/tick.svg" type="image/webp" />
						<img src="img/tick.svg" alt="Mail Minder" />
					</picture>
				</div>
				<picture>
					<source srcset="img/scheduled.svg" type="image/webp" />
					<img src="img/scheduled.svg" alt="Mail Minder Logo" />
				</picture>
			</div>
			<div class="schedule-popup__text">{title}</div>
		</div>
	</div>
{/if}
