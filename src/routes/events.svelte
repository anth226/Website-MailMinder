<script>
	/* COMPONENTS */

	import ScheduledEvents from '@components/Scheduled/ScheduledEvents.svelte';

	import CustomScrollbar from '@components/utils/CustomScrollbar.svelte';

	/* STORES */

	import { user } from '@stores/sessionStore';
	import { events } from '@stores/eventsStore';

	/* RUNTIME VARS */

	let scrollArea;
	let content;

	let isScrolling = false;

	/* FUNCTIONS */

	const scrollChange = (bool) => {
		isScrolling = bool;
	};
</script>

{#if $user}
	<section class="flex flex-col justify-center px-4 md:h-[70vh]">
		<div
			class="mx-auto max-w-3xl h-full w-full flex flex-col items-center md:bg-[#f7f7f7] md:border-[10px] border-white md:shadow-lg md:rounded-3xl relative px-2 md:px-5 pb-9"
			bind:this={scrollArea}
		>
			<h1 class="text-center font-bold text-2xl leading-7 text-[#333] mb-8 md:mb-0 md:py-9">
				Scheduled Events
			</h1>
			{#if $events && $events.length}
				<div
					bind:this={content}
					class="page__scheduled-items mx-auto active gray-bg-scroll md:pr-6 md:pl-2 md:overflow-y-scroll custom-scrollbar min-h-[80%]"
				>
					<!-- start::Event -->
					{#each $events as event, index (event.id)}
						<ScheduledEvents {event} {index} />
					{/each}
					<!-- end::Events -->
				</div>
			{:else if $events !== null}
				<div
					bind:this={content}
					class="page__scheduled-items mx-auto active gray-bg-scroll md:pr-6 md:pl-2 md:overflow-y-scroll custom-scrollbar min-h-[80%]"
				/>
			{:else}
				<div
					bind:this={content}
					class="page__scheduled-items mx-auto active gray-bg-scroll md:pr-6 md:pl-2 md:overflow-y-scroll custom-scrollbar skeleton min-h-[80%]"
				>
					<div class=" mask-fade ">
						{#each Array.from({ length: 7 }, (v, i) => i) as index}
							<img
								alt="skeleton loading"
								class="w-100 mb-4"
								src="./img/schedule-event-skeleton.svg"
							/>
						{/each}
					</div>
				</div>
			{/if}
			<CustomScrollbar on:scroll={scrollChange} {scrollArea} {content} />
		</div>
	</section>
{/if}
