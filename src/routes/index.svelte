<script>
	import { beforeNavigate } from '$app/navigation';
	import { onMount } from 'svelte';

	/* COMPONENTS */

	import Cross from '@assets/img/cross.svelte';

	import Auth from '@components/shared/Auth.svelte';
	import CalendarInput from '@components/Home/CalendarInput.svelte';
	import EventDetails from '@components/Home/EventDetails.svelte';

	import { routeToPage } from '@utils/router';

	import { user, notification } from '@stores/sessionStore';

	import { supabase } from '@utils/supabaseClient';

	import { events, fetchEvents, isEditing, event } from '@stores/eventsStore';

	import { fade, slide } from 'svelte/transition';

	const handleAddEvent = (event) => {
		let tempEvents = [...$events];
		tempEvents.push(event.detail);
		tempEvents = tempEvents.sort(function (a, b) {
			if (a.date > b.date) return 1;
			if (a.date < b.date) return -1;
			return 0;
		});

		// console.log("handleAddEvent", events, event.detail);

		$events = tempEvents;
	};

	user.set(supabase.auth.user());

	supabase.auth.onAuthStateChange((_, session) => {
		if (session) {
			user.set(session.user);
			notification.set(false);
			fetchEvents();
		} else {
			$events = [];
			user.set(false);
		}
	});

	const clearEditing = () => {
		$event = {};
		$isEditing = false;
	};

	//console.log('CHECKING PAGE', $page);

	let initialized = false;

	let route;
	let queryParams;

	onMount(async () => {
		route = window.location;

		const urlParams = new URLSearchParams(route.search);

		queryParams = Object.fromEntries(urlParams);

		if (queryParams && queryParams.id) {
			$isEditing = true;
		} else {
			clearEditing();
		}
	});

	$: {
		if ($events && !initialized) {
			if (queryParams && queryParams.id) {
				$event = $events.find((event) => {
					return event.id == queryParams.id;
				});

				initialized = true;
			}
		}
	}

	beforeNavigate(() => {
		clearEditing();
	});
</script>

<main class="page">
	<section class="page__form-section form-section relative  pb-32 md:pb-0">
		{#if $isEditing}
			<div
				transition:fade={{ duration: 200 }}
				class="absolute top-0 left-1/2 -translate-x-1/2 max-w-[1200px] w-[90%] md:w-[92.5%] h-[88%] md:h-[95.75%] border-2 border-[#D1D1D1] rounded-xl"
			/>
		{/if}
		<div class="form-section__container container mx-auto">
			<div class="form-section__form form md:px-4 ">
				{#if $isEditing}
					<div
						transition:slide={{ duration: 200 }}
						class="mb-2 bg-[#f7f7f7] -translate-y-1/2 pl-6 pr-8"
					>
						<button
							class="bg-[#A8A8A8]/30 hover:bg-[#A8A8A8]/60 text-xs pl-3.5 pr-6 py-1 rounded-l-lg font-medium relative transition-all duration-300 "
							on:click={() => {
								clearEditing();

								routeToPage('');
							}}
						>
							EDIT MODE
							<button
								class="bg-black text-white rounded-full p-1.5 select-none ml-auto flex justify-center items-center z-[110] absolute top-1/2 -translate-y-1/2 right-0 translate-x-1/2"
							>
								<Cross class="w-2.5 h-2.5" />
							</button>
						</button>
					</div>
				{/if}
				<div class="w-full max-w-3xl flex flex-col items-center">
					<CalendarInput />
					<EventDetails on:addEventToUi={handleAddEvent} />
					<Auth />
				</div>
			</div>
		</div>
	</section>
</main>
