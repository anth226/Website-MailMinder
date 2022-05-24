<script>
	import { notification } from '@stores/sessionStore';
	import { fly } from 'svelte/transition';

	export let text;

	$: {
		if ($notification)
			setTimeout(() => {
				$notification = null;
			}, 3000);
	}
</script>

{#if $notification}
	<div
		class="flex justify-center items-center self-center fixed w-80 h-20 z-[200] top-9 left-1/2 -translate-x-1/2 bg-white border-[1px] border-black shadow-lg rounded-xl px-6"
		transition:fly={{ y: -100 }}
	>
		<p class="text-center tracking-wide">{text}</p>

		<div class="ml-auto cursor-pointer" on:click={() => notification.set(false)}>
			<picture>
				<source srcset="img/cross.svg" type="image/webp" />
				<img src="img/cross.svg" alt="close" />
			</picture>
		</div>
	</div>
{/if}
