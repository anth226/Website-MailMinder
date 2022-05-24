<script>
	/* PACKAGES */

	import { onMount } from 'svelte';
	import { beforeNavigate } from '$app/navigation';
	import { slide, fade } from 'svelte/transition';
	import { sineIn, sineOut } from 'svelte/easing';
	import InlineSvg from 'svelte-inline-svg';

	import dayjs from 'dayjs';

	import OutClick from 'svelte-outclick';

	/* UTILITIES */

	import { eventRepeatToLabel } from '@utils/event';

	/* STORES */

	import { events, insertReminder, deleteEvent, updateEvent, sendEmail } from '@stores/eventsStore';
	import { user, notification } from '@stores/sessionStore';
	import { innerWidth } from '@stores/layoutStore';

	/* COMPONENTS */

	import Arrow from '@assets/img/arrow.svelte';

	import { routeToPage } from '@utils/router';

	import Reminder from './Reminder.svelte';

	/* PROPS */

	export let event;
	export let index;
	//export let isScrolling;

	/* LOCAL VARS */

	let showReminders = false;
	let showActionMenu = false;

	let reminders = [];

	let dropdownStyles = {};

	let addHover = false;
	let showRepeat = false;

	const baseUrl = import.meta.env.VITE_BACKEND_URL;

	/* FUNCTIONS */

	const toggleActionMenu = (bool, event) => {
		if (event) {
			/* console.log('CHECKING EVENT', event, event.target); */

			const { top, left } = event.target.getBoundingClientRect();
			dropdownStyles = {
				...dropdownStyles,
				top,
				left
			};
		}
		showActionMenu = bool;

		if (!bool) showRepeat = false;
		//console.log('CHECKING ACTON MENU TOGGLE', bool, event);
	};

	onMount(async () => {
		try {
			const response = await fetch(`${baseUrl}/reminder/findByEventId/${event.id}`);
			reminders = await response.json();

			//console.log(event, reminders);
		} catch (error) {
			console.error(error);
		}
	});

	const toggleReminders = (bool) => {
		if (bool === undefined) {
			showReminders = !showReminders;
		} else {
			showReminders = bool;
		}
	};

	const addReminder = async () => {
		// const dateToSave = getDateFormat(newReminderDate);
		const dateToSave = newReminderDate;
		const data = {
			date: dateToSave,
			event_id: event.id,
			uuid: $user.id,
			email: $user.email
		};

		//console.log(data);

		reminders = reminders && reminders.length ? [...reminders, data] : [data];

		const result = await insertReminder({ ...data, event_date: event.date });

		// add new reminder to reminders array
		if (result) {
			reminders[reminders.length - 1] = result;
			notification.set(`Reminder added for ${dateToSave}`);
		} else {
			reminders.pop();
			notification.set(`Error adding reminder for ${dateToSave}`);
		}
	};

	const removeEvent = async () => {
		showActionMenu = false;
		const eventToDelete = Object.assign({}, event);

		$events = $events.filter((eventIteration) => {
			return eventIteration.id !== event.id;
		});

		const result = await deleteEvent(event.id);

		//console.log('CHECKING RESULT', result);

		if (!result.error) {
			//console.log('EVENT DELETED', eventToDelete);
			notification.set(`Event deleted`);
			return result;
		} else {
			//console.log('EVENT NOT DELETED', eventToDelete);

			const oldEvents = $events.length ? [...$events] : [];

			oldEvents.splice(index, 0, eventToDelete);

			$events = oldEvents;

			notification.set(`Error deleting event`);

			return false;
		}
	};

	const editEvent = () => {
		routeToPage(`?id=${event.id}`);
	};

	const triggerReminderDelete = (event) => {
		const { reminder, index } = event.detail;

		const reminderToDelete = Object.assign({}, reminder);

		reminders = reminders.filter((reminderIteration) => {
			return reminderIteration.id !== reminder.id;
		});

		fetch(`${baseUrl}/reminder/${reminder.id}`, {
			method: 'DELETE'
		})
			.then((response) => response.json())
			.then((data) => {
				if (data && data.error) {
					throw new Error(data.error);
				}
				//console.log(data);
			})
			.catch((error) => {
				const oldReminders = reminders.length ? [...reminders] : [];

				oldReminders.splice(index, 0, reminderToDelete);

				reminders = oldReminders;

				console.log(error);
			});
	};

	const triggerEventUpdate = async (data) => {
		const eventToUpdate = Object.assign({}, event);

		$events[index] = { ...event, repeat: data.repeat };

		const result = await updateEvent(event.id, data);

		if (result) {
			return true;
		} else {
			console.error('ERROR WHILE UPDATING EVENT', (result && result.error) ?? result);
			const oldEvents = $events.length ? [...$events] : [];

			oldEvents.splice(index, 1, eventToUpdate);
			$events = oldEvents;

			return false;
		}
	};

	const changeRepeat = async (repeat) => {
		//showActionMenu = false;
		toggleActionMenu(false);
		const result = await triggerEventUpdate({ ...event, repeat });

		if (result) {
			notification.set(`Updated event repeat status to: ${repeat}`);
		} else {
			notification.set(`Error updating event repeat status`);
		}
	};

	/* REACTIVE STATEMENTS */

	$: newReminderDate = reminders.length
		? dayjs(reminders[reminders.length - 1].date, 'YYYY-MM-DD')
				.subtract(1, 'day')
				.format('YYYY-MM-DD')
		: event
		? event.date
		: dayjs().format('YYYY-MM-DD');

	beforeNavigate(() => {
		showReminders = false;
		showActionMenu = false;
	});
</script>

{#if $innerWidth >= 768}
	<div
		class="mb-4 relative hidden md:block"
		on:pointerleave={() => {
			addHover = false;
		}}
	>
		<div class="w-full h-full bg-white rounded-2xl">
			<div
				class="scheduled-item__top w-full flex justify-between items-center px-6 h-[72px] bg-white rounded-2xl z-20"
			>
				<div class="scheduled-item__left">
					<div class="scheduled-item__text">{event.title}</div>
					<div class="scheduled-item__date">
						<span>{event.date.split('-')[0]}</span> /
						<span>{event.date.split('-')[1]}</span>
						/ <span>{event.date.split('-')[2]}</span>
					</div>
					<div class="scheduled-item__period">
						<span>{eventRepeatToLabel(event.repeat)}</span>
					</div>
				</div>

				<div class="flex gap-x-5">
					<div
						class="scheduled-item__right rounded flex justify-center items-center relative border-2 border-[#333]/60 text-[#333]/60 leading-none px-2.5 h-7 cursor-pointer font-semibold text-sm"
						on:click|stopPropagation={() => toggleReminders()}
					>
						Reminders
					</div>

					<OutClick
						on:outclick={() => {
							toggleActionMenu(false);
						}}
					>
						<div
							class="scheduled-item__right  flex justify-center items-center relative w-14 h-7 cursor-pointer"
						>
							<div
								on:click|stopPropagation={() => toggleActionMenu(!showActionMenu)}
								class="flex justify-center items-center w-full h-full border-2 border-[#333]/60 rounded"
							>
								<div class="scheduled-item__dot pointer-events-none" />
								<div class="scheduled-item__dot pointer-events-none" />
								<div class="scheduled-item__dot pointer-events-none" />
							</div>
							{#if showActionMenu}
								<!-- style="top: {dropdownStyles.top}px; left:{dropdownStyles.left}px;" -->
								<div class="absolute top-full right-0 translate-x-[2px] pb-6 pt-2.5 z-[100]">
									<div
										transition:slide={{ duration: 200 }}
										class="scheduled-item__dropdown  bg-white rounded w-[114px] "
									>
										<div class="scheduled-item__dropdown-list gap-y-1 flex flex-col">
											<div
												class="hover:bg-[#c4c4c4]/20 uppercase font-medium px-3 py-2 rounded-md text-xs  leading-none"
												on:click|stopPropagation={() => {
													sendEmail({
														email: $user.email,
														event: { ...event, event_date: event.date },
														test: true
													});
													showActionMenu = false;
												}}
											>
												Send test
											</div>
											<div
												class="hover:bg-[#c4c4c4]/20 uppercase font-medium px-3 py-2 rounded-md text-xs  leading-none"
												on:click|stopPropagation={editEvent}
											>
												Edit
											</div>
											<div
												class="hover:bg-[#c4c4c4]/20 uppercase font-medium px-3 py-2 rounded-md text-xs  leading-none"
												on:click|stopPropagation={removeEvent}
											>
												Delete
											</div>
											<div
												class="hover:bg-[#c4c4c4]/20 uppercase font-medium px-3 py-2 rounded-md text-xs flex items-center leading-none"
												on:click|stopPropagation={() => {
													showRepeat = !showRepeat;
												}}
											>
												<span>Repeat</span>
												<InlineSvg
													src={'/img/arrow-down-filled.svg'}
													class={`ml-2 w-2 h-2 transition-all duration-300 opacity-50 text- ${
														showRepeat ? 'rotate-180' : 'rotate-0'
													}`}
												/>
											</div>
											{#if showRepeat}
												<div
													transition:slide={{ duration: 200 }}
													class="flex flex-col border-y-[1px] border-gray-500 my-1 py-2 gap-y-1"
												>
													<div
														class=" leading-none uppercase font-medium text-xs rounded-md px-3 py-2 hover:bg-[#c4c4c4]/20"
														on:click|stopPropagation={() => {
															changeRepeat('never');
														}}
													>
														Never
													</div>
													<div
														class=" leading-none uppercase font-medium text-xs rounded-md px-3 py-2 hover:bg-[#c4c4c4]/20"
														on:click|stopPropagation={() => {
															changeRepeat('day');
														}}
													>
														Daily
													</div>
													<div
														class=" leading-none uppercase font-medium text-xs rounded-md px-3 py-2 hover:bg-[#c4c4c4]/20"
														on:click|stopPropagation={() => {
															changeRepeat('week');
														}}
													>
														Weekly
													</div>
													<div
														class=" leading-none uppercase font-medium text-xs rounded-md px-3 py-2 hover:bg-[#c4c4c4]/20"
														on:click|stopPropagation={() => {
															changeRepeat('month');
														}}
													>
														Monthly
													</div>
													<div
														class=" leading-none uppercase font-medium text-xs rounded-md px-3 py-2 hover:bg-[#c4c4c4]/20"
														on:click|stopPropagation={() => {
															changeRepeat('quarter');
														}}
													>
														Quarterly
													</div>
													<div
														class=" leading-none uppercase font-medium text-xs rounded-md px-3 py-2 hover:bg-[#c4c4c4]/20"
														on:click|stopPropagation={() => {
															changeRepeat('year');
														}}
													>
														Yearly
													</div>
												</div>
											{/if}
										</div>
									</div>
								</div>
							{/if}
						</div>
					</OutClick>
				</div>
			</div>
			{#if showReminders}
				<div
					transition:slide={{
						duration: 400,
						delay: showReminders ? 0 : 200,
						easing: showReminders ? sineIn : sineOut
					}}
					class="px-3 z-10"
				>
					<div transition:fade={{ duration: 200, delay: showReminders ? 0 : 200 }}>
						<div class="reminders-list z-20 bg-white">
							{#if reminders.length}
								{#each reminders as reminder, index}
									<Reminder on:delete={triggerReminderDelete} {reminder} {index} {event} />
								{/each}
							{/if}
							<!-- Add reminder -->
							<li
								class="reminder-item add"
								data-add="reminder-add"
								on:click|stopPropagation={addReminder}
								on:pointerover={() => {
									addHover = true;
								}}
								on:pointerleave={() => {
									addHover = false;
								}}
							>
								<div class="reminder-item__left items-center">
									<div class="reminder-item__text ml-2">Add Reminder</div>

									<div class="separator mx-2" />
									<div class="flex relative gap-x-2 tracking-widest">
										<div>----</div>
										<div style="padding-top: 1px;">/</div>
										<div>--</div>
										<div style="padding-top: 1px;">/</div>
										<div>--</div>
									</div>
								</div>

								<button
									class={`w-8 h-8 rounded-full cursor-pointer flex justify-center items-center mr-4 my-auto ${
										addHover ? 'bg-white' : 'bg-transparent'
									}`}
									title="Add reminder"
								>
									<img
										alt="Add reminder"
										class=" w-4 h-4"
										src={addHover ? '/img/plus-black.svg' : '/img/plus.svg'}
									/>
								</button>
							</li>
						</div>
						<div
							class={`item-block__close cursor-pointer z-10 bg-white pt-5 pb-6`}
							on:click|stopPropagation={() => toggleReminders(false)}
						>
							<Arrow class="mr-3 w-3 h-3 text-[#CCCCCC]" />
							<div>Close</div>
						</div>
					</div>
				</div>
			{/if}
		</div>
	</div>
{/if}

{#if $innerWidth < 768}
	<div
		class="mb-4 relative md:hidden"
		on:pointerleave={() => {
			addHover = false;
		}}
	>
		<div class="bg-white rounded-2xl relative">
			<div class=" px-6 py-6 select-none">
				<h2 class="text-center text-base">
					{event.title}
				</h2>
				<p class="text-center text-sm my-3">
					<span>{event.date.split('-')[0]}</span> /
					<span>{event.date.split('-')[1]}</span>
					/ <span>{event.date.split('-')[2]}</span>
				</p>
				<div class="flex justify-center mx-auto text-sm">
					<span>{eventRepeatToLabel(event.repeat)}</span>
				</div>

				<div
					class="mt-3 rounded-md border-2 border-[#d1d1d1] w-full text-center cursor-pointer p-3 text-[#959595] font-semibold leading-none"
					on:click|stopPropagation={() => toggleReminders()}
				>
					Reminders
				</div>

				<div class="mt-3 rounded-md border-2 border-[#d1d1d1] w-full text-center cursor-pointer">
					{#if showActionMenu}
						<div
							transition:slide={{ duration: 200 }}
							style=""
							class="px-3 pt-6 pb-3 rounded-lg flex flex-col gap-y-6 font-bold"
						>
							<div
								class="  leading-none"
								on:click|stopPropagation={() => {
									sendEmail({
										email: $user.email,
										event: { ...event, event_date: event.date },
										test: true
									});
									showActionMenu = false;
								}}
							>
								Send test
							</div>
							<div class="  leading-none" on:click|stopPropagation={editEvent}>Edit</div>
							<div class="  leading-none" on:click|stopPropagation={removeEvent}>Delete</div>
							<div
								class="flex items-center justify-center leading-none"
								on:click|stopPropagation={() => {
									showRepeat = !showRepeat;
								}}
							>
								<span>Repeat</span>
								<InlineSvg
									src={'/img/arrow-down-filled.svg'}
									class={`ml-2 w-2 h-2 transition-all duration-300 ${
										showRepeat ? 'rotate-180' : 'rotate-0'
									}`}
								/>
							</div>
							{#if showRepeat}
								<div
									transition:slide={{ duration: 200 }}
									class="flex flex-col border-y-[1px] border-gray-500 py-3 gap-y-3 font-semibold"
								>
									<div
										class=" leading-none uppercase text-sm"
										on:click|stopPropagation={() => {
											changeRepeat('never');
										}}
									>
										Never
									</div>
									<div
										class=" leading-none uppercase text-sm"
										on:click|stopPropagation={() => {
											changeRepeat('day');
										}}
									>
										Daily
									</div>
									<div
										class=" leading-none uppercase text-sm"
										on:click|stopPropagation={() => {
											changeRepeat('week');
										}}
									>
										Weekly
									</div>
									<div
										class=" leading-none uppercase text-sm"
										on:click|stopPropagation={() => {
											changeRepeat('month');
										}}
									>
										Monthly
									</div>
									<div
										class=" leading-none uppercase text-sm"
										on:click|stopPropagation={() => {
											changeRepeat('quarter');
										}}
									>
										Quarterly
									</div>
									<div
										class=" leading-none uppercase text-sm"
										on:click|stopPropagation={() => {
											changeRepeat('year');
										}}
									>
										Yearly
									</div>
								</div>
							{/if}
						</div>
					{/if}

					<div
						class="p-3 text-[#959595] font-semibold leading-none"
						on:click|stopPropagation={() => {
							toggleActionMenu(!showActionMenu);
						}}
					>
						{showActionMenu ? 'Less' : 'More'}
					</div>
				</div>
			</div>
			{#if showReminders}
				<div
					transition:slide={{
						duration: 400,
						delay: showReminders ? 0 : 200,
						easing: showReminders ? sineIn : sineOut
					}}
					class="w-full px-3 pb-6"
				>
					<div
						class="flex flex-col "
						transition:fade={{ duration: 200, delay: showReminders ? 0 : 200 }}
					>
						<div class="flex flex-col gap-y-1">
							{#if reminders.length}
								{#each reminders as reminder, index}
									<Reminder on:delete={triggerReminderDelete} {reminder} {index} {event} />
								{/each}
							{/if}
							<!-- Add reminder -->
							<div
								class="flex p-4 justify-center items-center bg-[#F7F7F7] rounded-lg cursor-pointer"
								on:click|stopPropagation={addReminder}
								on:pointerover={() => {
									addHover = true;
								}}
								on:pointerleave={() => {
									addHover = false;
								}}
							>
								<p class="text-sm font-medium ml-4">Add Reminder</p>

								<button
									class="w-8 h-8 rounded-full cursor-pointer hover:bg-white flex justify-center items-center my-auto text-[#959595] hover:text-black"
									title="Add reminder"
								>
									<img
										alt="Add reminder"
										class="w-4 h-4"
										src={addHover ? '/img/plus-black.svg' : '/img/plus.svg'}
									/>
								</button>
							</div>
						</div>
						<div
							class={`flex justify-center mx-auto mt-5 cursor-pointer transition-opacity duration-300 ${
								showReminders ? 'opacity-100' : 'opacity-0'
							}`}
							on:click|stopPropagation={() => {
								toggleReminders();
							}}
						>
							<Arrow class="mr-3 w-3 h-3 text-[#CCCCCC]" />
							<p>Close</p>
						</div>
					</div>
				</div>
			{/if}
		</div>
	</div>
{/if}
