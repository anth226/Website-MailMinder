<script>
	import { slide } from 'svelte/transition';
	import { createEventDispatcher } from 'svelte';

	import { clickOutside } from '../utils/clickOutside.js';
	import { countries } from '@constants/countries.js';

	import CustomScrollbar from '../utils/CustomScrollbar.svelte';

	/* COMPOENTS */

	import Cross from '@assets/img/cross.svelte';
	import { country } from '@stores/eventsStore.js';

	/* RUNTIME VARS */
	let scrollArea;
	let content;

	let showCountryList = false;

	let searchInput; // use with bind:this to focus element
	let inputValue = '';
	// Search results
	let filteredCountries = [];

	// Dispatch country to get holidays
	const dispatch = createEventDispatcher();

	$: if (!inputValue) {
		const storageArr = [];
		countries.forEach((country) => {
			storageArr.push(country.name);
		});
		filteredCountries = storageArr;
		//filteredCountries = storageArr.sort();
		// hiLiteIndex = null
	}

	const toggleShowCountryList = async (boolean) => {
		if (boolean !== undefined) {
			showCountryList = boolean;
		} else {
			showCountryList = !showCountryList;
		}
	};

	const setInputVal = (countryName) => {
		toggleShowCountryList(false);
		inputValue = '';

		dispatch(
			'changeCountry',
			countries.find((country) => {
				return country.name === removeBold(countryName);
			})
		);

		$country = removeBold(countryName);
	};

	/* FILTERING countres DATA BASED ON INPUT */
	const filterCountries = () => {
		let storageArr = [];
		if (inputValue) {
			countries.forEach((country) => {
				if (country.name.toLowerCase().startsWith(inputValue.toLowerCase())) {
					storageArr = [...storageArr, makeMatchBold(country.name)];
				}
			});
		} else {
			countries.forEach((country) => {
				storageArr.push(country.name);
			});
		}
		storageArr.sort();
		filteredCountries = storageArr;
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

<div
	class="flex justify-between items-center min-w-80 w-full max-w-md h-14 bg-white rounded-2xl mb-8 cursor-pointer relative"
>
	<div
		class="flex justify-between items-center w-full  px-6 py-4"
		on:click={() => toggleShowCountryList(true)}
	>
		<h6 class="country__value">{$country}</h6>
		<img src="../img/arrow-down.svg" alt="" />
	</div>
	{#if showCountryList}
		<div
			transition:slide={{ duration: 200 }}
			bind:this={scrollArea}
			class=" py-4 px-6 min-w-80 w-full max-w-md bg-white shadow-lg rounded-2xl absolute top-0 left-1/2 z-[100] -translate-x-1/2"
			use:clickOutside
			on:click_outside={() => toggleShowCountryList(false)}
		>
			<button
				class="bg-black text-white rounded-full hover:bg-[#959595] hover:text-white p-1.5 select-none transition-all duration-300 ml-auto flex justify-center items-center z-[110]  absolute top-0 right-0 mt-4 mr-6"
				on:click={() => {
					toggleShowCountryList(false);
				}}
			>
				<Cross class="w-3 h-3" />
			</button>
			<!-- svelte-ignore a11y-autofocus -->
			<input
				id="input-tz"
				type="text"
				autocomplete="off"
				placeholder="Search Category / Country"
				bind:this={searchInput}
				bind:value={inputValue}
				on:input={filterCountries}
				class="w-full bg-transparent text-lg tracking-wide border-b-2 border-[#d1d1d1] pb-2"
				style="display: block"
				autofocus
			/>
			<div
				bind:this={content}
				class="autocomplete-layout md:overflow-y-scroll custom-scrollbar custom-scrollbar-white"
			>
				<div class="autocomplete-layout__panel">
					<!-- LIST OF TIMEZONES -->
					{#each filteredCountries as country, i}
						<p
							class="autocomplete-layout__panel-content clickable"
							on:click={() => setInputVal(country)}
						>
							{@html country}
						</p>
					{/each}
				</div>
			</div>
		</div>
		<CustomScrollbar {scrollArea} {content} />
	{/if}
</div>

<style>
	.country__value {
		font-style: normal;
		font-weight: 500;
		font-size: 18px;
		line-height: 22px;
	}
</style>
