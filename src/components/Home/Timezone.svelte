<script>
	import { onMount, tick, createEventDispatcher } from 'svelte';
	// Dayjs and timezone imports
	import dayjs from 'dayjs';
	import utc from 'dayjs/plugin/utc.js';
	import timezone from 'dayjs/plugin/timezone.js';
	dayjs.extend(utc);
	dayjs.extend(timezone);
	import { timezones } from '@constants/timezonesData.js'; //Local tz data list

	import CustomScrollbar from '../utils/CustomScrollbar.svelte';
	let content;

	export let scrollArea;

	let showAutocomplete = false;
	// Search results
	let filteredTimezones = [];

	// Set initial timezone value in the form of 'Asia/Singapore'
	let tzValue = dayjs.tz.guess();
	onMount(async () => {
		dispatch('timezone', tzValue);
	});

	/* HANDLING THE INPUT */
	let searchInput; // use with bind:this to focus element
	let inputValue = '';

	$: if (!inputValue) {
		const storageArr = [];
		timezones.forEach((country) => {
			storageArr.push(getCity(country));
		});
		filteredTimezones = storageArr.sort();
		// hiLiteIndex = null
	}
	// Dispatch show autocomplete to event details to show/hide event title field
	const dispatch = createEventDispatcher();
	const showEventTitleField = (boolean) => {
		dispatch('showEventTitleField', boolean);
	};
	const toggleShowAutocomplete = async (boolean) => {
		if (boolean !== undefined) {
			showAutocomplete = boolean;
		} else {
			showAutocomplete = !showAutocomplete;
		}
		// Focus search input
		if (showAutocomplete) {
			await tick();
			searchInput.focus();
		}
		// Emit event to show/hide event title
		showEventTitleField(!showAutocomplete);
		// Reset search field
		if (!showAutocomplete) {
			inputValue = '';
		}
	};

	// Utility function to get city name from timezone format i.e 'Europe/San_Juan' returns 'San Juan'
	const getCity = (string) => {
		if (string) {
			const n = string.lastIndexOf('/');
			const city = string.substring(n + 1).replace(/_/g, ' ');
			return city;
		}
		return false;
	};

	/* FILTERING countres DATA BASED ON INPUT */
	const filterTimezones = () => {
		let storageArr = [];
		if (inputValue) {
			timezones.forEach((country) => {
				const city = getCity(country);
				if (city.toLowerCase().startsWith(inputValue.toLowerCase())) {
					storageArr = [...storageArr, makeMatchBold(city)];
				}
			});
		} else {
			timezones.forEach((country) => {
				const city = getCity(country);
				storageArr.push(city);
			});
		}
		storageArr.sort();
		filteredTimezones = storageArr;
	};

	const setInputVal = (countryName) => {
		toggleShowAutocomplete(false);
		tzValue = timezones.find((item) => {
			return item.match(removeBold(countryName).replaceAll(' ', '_'));
		});
		// Dispatch event to parent
		dispatch('timezone', tzValue);
		inputValue = '';
	};

	const makeMatchBold = (str) => {
		// replace part of (country name === inputValue) with strong tags
		let matched = str.substring(0, inputValue.length);
		let makeBold = `<strong>${matched}</strong>`;
		let boldedMatch = str.replace(matched, makeBold);
		return boldedMatch;
	};

	const removeBold = (str) => {
		//replace < and > all characters between
		return str.replace(/<(.)*?>/g, '');
	};
</script>

{#if !showAutocomplete}
	<div class="message__header">
		<div
			id="toggle-tz"
			class="message__button unselectable"
			on:click={() => toggleShowAutocomplete(true)}
		>
			<h6 class="placeholder">TIME ZONE:</h6>
			<h6 class="timezone__value">{getCity(tzValue)}</h6>
		</div>
	</div>
{:else}
	<div class="timezone__header" on:click={() => toggleShowAutocomplete(false)}>
		<h6 class="placeholder">TIME ZONE:</h6>
		<h6 id="button-tz-save" class="timezone__button unselectable">CLOSE</h6>
	</div>
	<div>
		<input
			id="input-tz"
			type="text"
			autocomplete="off"
			placeholder="Search City"
			bind:this={searchInput}
			bind:value={inputValue}
			on:input={filterTimezones}
			class="w-full bg-transparent text-lg tracking-wide border-b-2 border-[#d1d1d1] pb-2"
		/>
		<div class="autocomplete-layout md:overflow-y-scroll custom-scrollbar" bind:this={content}>
			<div class="autocomplete-layout__panel">
				<!-- FILTERED LIST OF TIMEZONES -->
				{#each filteredTimezones as country, i}
					<p class="autocomplete-layout__panel-content ">
						<span class="clickable" on:click={() => setInputVal(country)}>
							{@html country}
						</span>
					</p>
				{/each}
			</div>
		</div>
	</div>
	<CustomScrollbar {scrollArea} {content} />
{/if}

<style>
</style>
