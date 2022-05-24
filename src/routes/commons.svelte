<script>
	/* STORES */

	import { commonEvents, holidays, fetchHolidays } from '@stores/eventsStore';

	import { user } from '@stores/sessionStore';

	/* COMPONENTS */

	import CountrySelector from '@components/Common/CountrySelector.svelte';
	import CommonEvent from '@components/Common/CommonEvent.svelte';

	import CustomScrollbar from '@components/utils/CustomScrollbar.svelte';

	/* RUNTIME VARS */

	let scrollArea;
	let content;

	/* FUNCTIONS */

	const handleChangeCountry = async (event) => {
		console.log(event.detail, ' - ', $commonEvents, $holidays);
		await fetchHolidays(event.detail.code);
	};

	$: selectedHolidays = $commonEvents
		? $holidays.reduce((accumulator, current) => {
				const isHolidaySelected = $commonEvents.find((commonEvent) => {
					return commonEvent.title == current.title && commonEvent.date == current.date;
				});

				return [
					...accumulator,
					{
						...current,
						selected: !!isHolidaySelected ?? false,
						id: isHolidaySelected ? isHolidaySelected.id : false
					}
				];
		  }, [])
		: [];
</script>

{#if $user}
	<section class="flex flex-col justify-center px-4 md:h-[70vh]">
		<div
			bind:this={scrollArea}
			class="mx-auto max-w-3xl h-full w-full flex flex-col items-center md:bg-[#f7f7f7] md:border-[10px] border-white md:shadow-lg md:rounded-3xl relative px-2 md:px-5 pb-9"
		>
			<h1 class="text-center font-bold text-2xl leading-7 text-[#333] mb-8 md:mb-0 md:py-9">
				Common Events
			</h1>
			<!-- <p>{JSON.stringify(selectedHolidays)}</p> -->
			<CountrySelector on:changeCountry={handleChangeCountry} />
			{#if selectedHolidays.length}
				<div
					bind:this={content}
					class="page__scheduled-items my-auto common-events active md:overflow-y-scroll overflow-x-visible gray-bg-scroll md:pr-6 md:pl-2 custom-scrollbar"
				>
					<!-- start::Common Events -->
					{#each selectedHolidays as event, i (`${i}-${event.date}-${event.name}`)}
						<CommonEvent {event} />
					{/each}
					<!-- end::Common Events -->
				</div>
			{/if}
		</div>
		<CustomScrollbar {scrollArea} {content} />
	</section>
{/if}
