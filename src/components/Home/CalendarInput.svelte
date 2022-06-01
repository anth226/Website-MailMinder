<script>
	import { event } from '@stores/eventsStore';

	import dayjs from 'dayjs';

	/* COMPONENTS */
	import ArrowLeft from '@assets/img/arrow-left.svelte';

	import ArrowRight from '@assets/img/arrow-right.svelte';

	let today = dayjs();
	let hoveredBlock = 99;

	const handleChange = (type, e) => {
		const value = e.target.value;

		switch (type) {
			case 'year':
				today = today.year(parseInt(`20${value}`));
				break;
			case 'month':
				today = today.month(value - 1);
				break;
			case 'day':
				today = today.date(value);
				break;
		}
	};

	const handleClick = (type, value) => {
		today = today.add(value, type);
	};

	/* REACTIVE STATEMENTES */

	$: day = today.format('DD');
	$: month = today.format('MM');
	$: year = today.format('YY');

	$: ddd = today.format('dddd');
	$: mmm = today.format('MMMM');

	$: {
		if (today) {
			event.set({ ...$event, date: today.format('YYYY-MM-DD') });
		}
	}

	event.subscribe((newValue) => {
		//console.log('EVENT', newValue);
		if (newValue.date || (!newValue.date && !newValue.title)) {
			today = dayjs(newValue.date, 'YYYY-MM-DD');
		}
	});

	/* $: {
    	//console.log('CHECKING VARIABLES', today, year, month, days, mmm, ddd)
  	} */
</script>

<div
	class="w-full form__datepicker datepicker flex flex-col md:flex-row gap-6 z-50 max-w-3xl mx-auto relative items-center justify-center px-10"
>
	<div
		class="datepicker__block items-center rounded-2.5xl bg-white flex flex-col justify-center transition-all hover:shadow-lg duration-300 w-[228px] md:w-[200px] h-[160px]"
		on:mouseenter={() => {
			hoveredBlock = 1;
		}}
		on:mouseleave={() => {
			hoveredBlock = 99;
		}}
	>
		<div class="flex items-center justify-evenly md:justify-between">
			<!-- svelte-ignore a11y-positive-tabindex -->
			<button
				class={`rounded-md transition-all hover:bg-[#a8a8a8]/20 duration-300 text-[#959595] p-2.5 ${
					hoveredBlock == 1 ? 'bg-[#a8a8a8]/20' : 'bg-transparent'
				}`}
				on:click={() => {
					handleClick('year', -1);
				}}
				tabindex="-1"
			>
				<ArrowLeft class="w-3 h-3" />
			</button>
			<div
				style="padding-left:1.5px"
				class=" border-b-2 border-[#d1d1d1] text-4xl  leading-none flex items-center justify-center text-center mx-0.75 w-[112px]"
			>
				<!-- <label class="text-[#a8a8a8]" for="Year">20</label> -->
				<input id="custom" class="w-[44px]" value={20} disabled />
				<!-- svelte-ignore a11y-positive-tabindex -->
				<input
					class="w-[44px]"
					name="Year"
					autocomplete="off"
					type="number"
					maxlength="2"
					min="1"
					value={year}
					max="99"
					required
					on:change|preventDefault={(e) => handleChange('year', e)}
					on:input={(e) => {
						if (e.target.value.length > 2) e.target.value = e.target.value.slice(0, 2);
					}}
					tabindex="2"
					id="focusguard-start"
				/>
			</div>
			<button
				class={`rounded-md transition-all hover:bg-[#a8a8a8]/20 duration-300 text-[#959595] p-2.5 ${
					hoveredBlock == 1 ? 'bg-[#a8a8a8]/20' : 'bg-transparent'
				}`}
				on:click={() => {
					handleClick('year', 1);
				}}
				tabindex="-1"
			>
				<ArrowRight class="w-3 h-3" />
			</button>
		</div>
		<span class="text-[#a8a8a8] text-lg mt-2.5 mx-auto">Year</span>
	</div>
	<div
		class="datepicker__block items-center rounded-2.5xl bg-white flex flex-col justify-center transition-all hover:shadow-lg duration-300 w-[228px] md:w-[200px] h-[160px]"
		on:mouseenter={() => {
			hoveredBlock = 2;
		}}
		on:mouseleave={() => {
			hoveredBlock = 99;
		}}
	>
		<div class="flex items-center justify-evenly md:justify-between">
			<!-- svelte-ignore a11y-positive-tabindex -->

			<button
				class={`rounded-md transition-all hover:bg-[#a8a8a8]/20 duration-300 text-[#959595] p-2.5 ${
					hoveredBlock == 2 ? 'bg-[#a8a8a8]/20' : 'bg-transparent'
				}`}
				on:click={() => {
					handleClick('month', -1);
				}}
				tabindex="-1"
			>
				<ArrowLeft class="w-3 h-3" />
			</button>
			<div
				class=" border-b-2 border-[#d1d1d1] text-4xl  leading-none flex items-center mx-0.75 w-[112px] justify-center"
			>
				<!-- svelte-ignore a11y-positive-tabindex -->
				<input
					class="text-center w-full"
					name="Month"
					autocomplete="off"
					type="number"
					min="1"
					maxlength="2"
					tabindex="3"
					value={month}
					max="12"
					required
					on:change|preventDefault={(e) => handleChange('month', e)}
					on:input={(e) => {
						if (e.target.value.length > 2) e.target.value = e.target.value.slice(0, 2);
					}}
				/>
			</div>
			<button
				class={`rounded-md transition-all hover:bg-[#a8a8a8]/20 duration-300 text-[#959595] p-2.5 ${
					hoveredBlock == 2 ? 'bg-[#a8a8a8]/20' : 'bg-transparent'
				}`}
				on:click={() => {
					handleClick('month', 1);
				}}
				tabindex="-1"
			>
				<ArrowRight class="w-3 h-3" />
			</button>
		</div>
		<span class="text-[#a8a8a8] text-lg mt-2.5 mx-auto">{mmm ? mmm : ''}</span>
	</div>

	<div
		class="datepicker__block items-center rounded-2.5xl bg-white flex flex-col justify-center transition-all hover:shadow-lg duration-300 w-[228px] md:w-[200px] h-[160px]"
		on:mouseenter={() => {
			hoveredBlock = 3;
		}}
		on:mouseleave={() => {
			hoveredBlock = 99;
		}}
	>
		<div class="flex items-center justify-evenly md:justify-between ">
			<!-- svelte-ignore a11y-positive-tabindex -->

			<button
				class={`rounded-md transition-all hover:bg-[#a8a8a8]/20 duration-300 text-[#959595] p-2.5 ${
					hoveredBlock == 3 ? 'bg-[#a8a8a8]/20' : 'bg-transparent'
				}`}
				on:click={() => {
					handleClick('day', -1);
				}}
				tabindex="-1"
			>
				<ArrowLeft class="w-3 h-3" />
			</button>
			<div
				class=" border-b-2 border-[#d1d1d1] text-4xl  leading-none flex items-center mx-0.75 w-[112px] justify-center"
			>
				<!-- svelte-ignore a11y-positive-tabindex -->
				<input
					class="text-center w-full"
					name="Day"
					autocomplete="off"
					type="number"
					min="1"
					maxlength="2"
					tabindex="3"
					value={day}
					max="31"
					required
					on:change|preventDefault={(e) => handleChange('day', e)}
				/>
			</div>
			<button
				class={`rounded-md transition-all hover:bg-[#a8a8a8]/20 duration-300 text-[#959595] p-2.5 ${
					hoveredBlock == 3 ? 'bg-[#a8a8a8]/20' : 'bg-transparent'
				}`}
				on:click={() => {
					handleClick('day', 1);
				}}
				tabindex="-1"
			>
				<ArrowRight class="w-3 h-3" />
			</button>
		</div>
		<span class="text-[#a8a8a8] text-lg mt-2.5 mx-auto">{ddd ? ddd : ''}</span>
	</div>
</div>

<style>
	#custom {
		background-color: transparent !important;
	}
</style>
