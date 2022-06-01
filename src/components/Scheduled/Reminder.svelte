<script>
	/* PACKAGES */
	import dayjs from 'dayjs';

	import { createEventDispatcher } from 'svelte';

	//import { events }

	/* PROPS */

	export let event;
	export let reminder;
	export let index;

	/* LOCAL VARS */

	const dispatch = createEventDispatcher();

	const baseUrl = import.meta.env.VITE_BACKEND_URL;

	let hover = false;

	/* COMPONENT */

	/* REACTIVE STATEMENTS */

	$: daysDifference = event.common
		? dayjs(event.date).add(1, 'day').diff(reminder.date, 'days')
		: dayjs(event.date).diff(reminder.date, 'days');

	/* FUNCTIONS */

	const addDays = (date, days) => {
		const result = dayjs(date).add(days, 'day').format('YYYY-MM-DD');
		//console.log('CHECKING DAYS', date, days, result)

		return result;
	};

	const incrementReminderDate = (value) => {
		//console.log('CHECKING DATE BEFORE', value, reminder.date)
		const newReminderDate = addDays(reminder.date, value);
		reminder.date = newReminderDate;

		//console.log('CHECKING DATE', newReminderDate, reminder.date)
		fetch(`${baseUrl}/reminder/${reminder.id}`, {
			method: 'PUT',
			body: JSON.stringify({ date: newReminderDate }),
			headers: {
				'Content-Type': 'application/json'
			}
		})
			.then((response) => response.json())
			.then(() => {
				// data
			})
			.catch((error) => {
				console.log(error);
			});
	};

	const deleteReminder = () => {
		dispatch('delete', { reminder, index });
	};
</script>

<div
	class="md:hidden flex flex-col w-full p-4 bg-[#F7F7F7] rounded-2xl relative text-sm select-none"
	on:pointerleave={() => {
		hover = false;
	}}
>
	<div class="flex items-center justify-center w-full p-2 bg-white rounded-md">
		<button
			class="rounded-md active:bg-[#959595] p-1"
			on:click={() => {
				incrementReminderDate(1);
			}}
		>
			<img class=" w-2 h-2" src="/img/arrow-left.svg" alt="Increment date" />
		</button>

		<div class="mx-2">
			<span class="">{daysDifference}</span>{daysDifference === 1 ? ' day' : ' days'}
		</div>
		<button
			class="rounded-md active:bg-[#959595] p-1"
			on:pointerover={() => {
				hover = true;
			}}
			on:pointerleave={() => {
				hover = false;
			}}
			on:click={() => {
				incrementReminderDate(-1);
			}}
		>
			<img class=" w-2 h-2" src="/img/arrow-right.svg" alt="Decrease date" />
		</button>
	</div>
	<div class="flex gap-x-2 justify-center tracking-wider mt-4">
		{reminder.date.replace(/-/g, '/')}
	</div>
	<div
		class="border-2 border-[#d1d1d1] p-3 text-[#959595] font-semibold cursor-pointer rounded-md text-center mt-3 leading-none"
		on:click|stopPropagation={deleteReminder}
	>
		Delete
	</div>
</div>

<li
	class="reminder-item hidden md:block"
	on:pointerleave={() => {
		hover = false;
	}}
>
	<div class="reminder-item__left items-center">
		<div class="reminder-item__days">
			<button
				class="quantity__button quantity__button_minus"
				type="button"
				on:click={() => {
					incrementReminderDate(1);
				}}
			/>
			<div class="select-none">{daysDifference - 1}{daysDifference === 1 ? ' day' : ' days'}</div>
			<button
				class="quantity__button quantity__button_plus"
				type="button"
				on:click={() => {
					incrementReminderDate(-1);
				}}
			/>
		</div>
		<div class="separator mx-2" />
		<div class="reminder-item__date flex relative gap-x-1 select-none">
			<span>{reminder.date.split('-')[0]}</span>
			<span>/</span>
			<span>{reminder.date.split('-')[1]}</span>
			<span>/</span>
			<span>{reminder.date.split('-')[2]}</span>
		</div>
	</div>
	<button
		class="w-8 h-8 rounded-full cursor-pointer hover:bg-white flex justify-center items-center mr-4 my-auto text-[#959595] hover:text-black"
		title="Delete reminder"
		on:click={deleteReminder}
		on:pointerover={() => {
			hover = true;
		}}
		on:pointerleave={() => {
			hover = false;
		}}
	>
		<img
			alt="Delete reminder"
			class=" w-4 h-4"
			src={hover ? '/img/minus-black.svg' : '/img/minus.svg'}
		/>
	</button>
</li>
