<script>
	import Navbar from '@components/header/Navbar.svelte';

	import Notification from '@components/shared/Notification.svelte';

	import { user, notification } from '@stores/sessionStore';
	import { supabase } from '@utils/supabaseClient';

	import { routeToPage } from '@utils/router';

	import { page } from '$app/stores';
	import {
		events,
		holidays,
		getUsersCountry,
		fetchHolidays,
		fetchEvents
	} from '@stores/eventsStore';

	import { innerWidth } from '@stores/layoutStore';

	import { onMount } from 'svelte';

	import '@assets/styles/global.css';
	import '@assets/styles/style.css';

	user.set(supabase.auth.user());

	supabase.auth.onAuthStateChange((_, session) => {
		if (session) {
			user.set(session.user);
			notification.set(false);
			// fetchEvents()
		} else {
			// events = []
			user.set(false);
		}
	});

	onMount(async () => {
		if (!$events || !$events.length) await fetchEvents();

		if (!$holidays || !$holidays.length) {
			const countryCode = await getUsersCountry();
			//console.log('CHECKING COUNTRY', countryCode);
			await fetchHolidays(countryCode);
		}

		if (!$user && $page.url.pathname.length > 1) {
			routeToPage('');
		}
	});
</script>

<header />
<Navbar />
<Notification text={$notification} />

<svelte:window bind:innerWidth={$innerWidth} />

<slot />
