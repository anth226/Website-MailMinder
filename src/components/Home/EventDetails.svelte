<script>
	/* PACKAGES */
	import { createEventDispatcher } from 'svelte';

	/* STORES */

	import { user, notification } from '@stores/sessionStore';

	import {
		events,
		event,
		isEditing,
		insertEvent,
		insertReminder,
		updateEvent
	} from '@stores/eventsStore';

	/* UTILS */

	import { routeToPage } from '@utils/router';

	/* COMPONENTS */

	import Timezone from './Timezone.svelte';

	/* RUNTIME VARS */

	const dispatch = createEventDispatcher();

	let email;
	let timezone;
	let sending = false;
	let showEventTitleField = true;

	let scrollArea;

	/* FUNCTIONS */

	const padTo2Digits = (num) => {
		return num.toString().padStart(2, '0');
	};

	const formatDate = (date) => {
		return [
			date.getFullYear(),
			padTo2Digits(date.getMonth() + 1),
			padTo2Digits(date.getDate())
		].join('-');
	};

	const addDays = (date, days) => {
		const result = new Date(date);
		result.setDate(result.getDate() + days);
		return formatDate(result);
	};

	const handleClick = async () => {
		if (!$user && !email) {
			return notification.set('Email address is required.');
		}
		sending = true;

		let data = {
			date: $event.date,
			title: $event.title,
			repeat: $event?.repeat || 'year',
			common: false,
			uuid: $user.id ?? undefined,
			email: $user.email || email
		};
		// If authenticated user, set UUID and email

		if ($isEditing) {
			delete data.uuid;
			const result = await updateEvent($event.id, data);
			if (result && result[0] && !result.error) {
				const updatedEvent = result[0];

				const replaceIndex = $events.findIndex((event) => {
					return event.id == updatedEvent.id;
				});

				$events[replaceIndex] = updatedEvent;
				// show = true;

				routeToPage(``);
				notification.set('Mail minder updated!');
				$event = {};
				sending = false;
				if (!$user) email = '';
			}
		} else {
			const result = await insertEvent(data);

			if (result && !result.error) {
				// delete data.title
				data.event_id = result.id;
				// Create 3 reminders for each event
				const reminderSchedule = [0, -1, -2, -3]; // Days before event
				let tempEventDate = data.date;

				await Promise.all([
					...reminderSchedule.map(async (value, index) => {
						let loopData = Object.assign({}, data);

						loopData.date = addDays(tempEventDate, value);

						loopData.event_date = tempEventDate;

						console.log('CHECKING $EVENT', $event);

						const mapResult = await insertReminder({
							...loopData,
							...$event,
							date: loopData.date,
							email: $user.email
						});

						if (index === reminderSchedule.length - 1) {
							dispatch('addEventToUi', result);
						}

						return mapResult;
					})
				]);

				// show = true;
				notification.set('Mail minder scheduled!');
				$event = {};
				sending = false;
				if (!$user) email = '';
			} else {
				sending = false;
				notification.set(`${result.error[0].param}: ${result.error[0].msg}`);
			}
		}
	};
</script>

<div class="flex">
	<!-- <Modal title={"MAIL SCHEDULED!"} {show} /> -->
	<div bind:this={scrollArea} class="card message__card">
		<Timezone
			{scrollArea}
			on:showEventTitleField={(event) => (showEventTitleField = event.detail)}
			on:timezone={(event) => (timezone = event.detail)}
		/>
		{#if showEventTitleField}
			<!-- svelte-ignore a11y-positive-tabindex -->
			<input
				type="text"
				name="Message"
				id="Message"
				class="input message"
				value={$event.title ?? ''}
				on:input={(e) => {
					$event = { ...$event, title: e.target.value };
				}}
				tabindex="5"
				placeholder="A memorable event title"
				required
			/>
		{/if}
	</div>
	<div class="form__email email">
		{#if $user}
			<!-- svelte-ignore a11y-positive-tabindex -->
			<input
				autocomplete="on"
				type="email"
				name="email"
				class="input mb-16"
				placeholder="Your email address"
				value={$user.email}
				disabled
				tabindex="6"
				required
			/>
		{:else}
			<!-- svelte-ignore a11y-positive-tabindex -->
			<input
				autocomplete="on"
				type="email"
				name="email"
				class="input mb-16"
				placeholder="Your email address"
				bind:value={email}
				tabindex="6"
				required
			/>
		{/if}
		<!-- svelte-ignore a11y-positive-tabindex -->
		<div class="bg-[#f7f7f7] px-6">
			<button
				id="focusguard-end"
				type="submit"
				class="form__button button"
				tabindex="7"
				on:click|preventDefault={handleClick}
			>
				{sending ? ($isEditing ? 'Saving...' : 'Scheduling...') : $isEditing ? 'Save' : 'Schedule'}
			</button>
		</div>
		<!-- svelte-ignore a11y-positive-tabindex -->
		<div tabindex="8" on:focus={() => document.getElementById('focusguard-start').focus()} />
	</div>
</div>

<style>
	input.message {
		display: block;
		height: 48px;
		padding: 10px 0 10px 0;
		border-bottom: 2px solid #d1d1d1;
		overflow: hidden;
		font-size: 20px;
		line-height: 150%;
		letter-spacing: 0.02em;
	}
	.flex {
		display: flex;
		flex-direction: column;
		align-items: center;
		width: 90%;
		max-width: 800px;
	}

	.mb-16 {
		margin-bottom: 50px;
	}

	.form__email {
		display: flex;
		flex-direction: column;
		align-items: center;
	}
</style>
