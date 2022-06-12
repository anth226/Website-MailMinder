<script>
	/* PACKAGES */
	import dayjs from 'dayjs';

	/* PROPS */
	export let event;

	/* STORES */

	import {
		events,
		insertEvent,
		deleteEvent,
		insertReminder
	} from '@stores/eventsStore';

	import { user, notification } from '@stores/sessionStore';

	/* LOCAL VARS */
	const formattedDate = dayjs(event.date).format('MMMM D');

	let hover = false;

	/* FUNCTIONS */

	const addEvent = async () => {
		const data = {
			title: event.title,
			date: dayjs(event.date).format('YYYY-MM-DD'),
			repeat: 'year',
			common: true,
			uuid: $user.id,
			email: $user.email
		};

		$events = [...$events, data];

		const index = $events.length - 1;

		const result = await insertEvent(data);

		$events.splice(index, 1, result);
		if (result && !result.error) {
			let reminderData = { uuid: $user.id };
			// delete data.title
			reminderData.event_id = result.id;
			// Create 3 reminders for each event
			const reminderSchedule = [0, -1, -2, -3]; // Days before event
			let tempEventDate = data.date;
			reminderSchedule.forEach(async (value) => {
				reminderData.date = dayjs(tempEventDate, 'YYYY-MM-DD')
					.add(value, 'day')
					.format('YYYY-MM-DD');

				await insertReminder({
					...reminderData,
					...event,
					title: event.title,
					date: reminderData.date,
					event_date: dayjs(event.date).format('YYYY-MM-DD'),
					email: $user.email
				});
			});
			// show = true;
			notification.set('Common event scheduled!');
		} else {
			notification.set(`${result.error[0].param}: ${result.error[0].msg}`);

			$events.pop();
		}
	};

	const removeEvent = async () => {
		const eventToDelete = Object.assign({}, event);
		const eventId =
			eventToDelete.id ??
			$events.find((commonEvent) => {
				return commonEvent.title == event.title && commonEvent.date == event.date;
			}).id;

		const index = $events.findIndex((commonEvent) => {
			return commonEvent.title == event.title && commonEvent.date == event.date;
		});

		$events = $events.filter((eventIteration) => {
			return eventIteration.id !== eventId;
		});

		//console.log('eventToDelete', eventToDelete);

		const result = await deleteEvent(eventId);

		//console.log('CHECKING RESULT', result);

		if (!result.error) {
			//console.log('EVENT DELETED', eventToDelete);
			return result;
		} else {
			//console.log('EVENT NOT DELETED', eventToDelete);

			const oldevents = $events.length ? [...$events] : [];

			oldevents.splice(index, 0, eventToDelete);

			$events = oldevents;

			return false;
		}
	};
</script>

<div class="mb-4 relative hidden md:block flip-box w-full h-[72px]">
	<div class=" w-full h-full  relative flip-box-inner" class:show-back={event.selected}>
		<div
			class=" w-full h-[72px] flex justify-between items-center px-6 flip-box-front bg-white rounded-2xl"
		>
			<div class="flex items-center">
				<div class="scheduled-item__text">{event.title}</div>
				<div class="scheduled-item__date">
					<span>{formattedDate}</span>
				</div>
				<div class="scheduled-item__period">
					<span>Yearly</span>
				</div>
			</div>
			<button
				class="w-8 h-8 rounded-full cursor-pointer flex justify-center items-center  my-auto text-[#959595] hover:text-black"
				title="Add event"
				on:click={addEvent}
				on:pointerover={() => {
					hover = true;
				}}
				on:pointerleave={() => {
					hover = false;
				}}
			>
				<img
					alt="Add event"
					class=" w-4 h-4"
					src={hover ? '/img/plus-black.svg' : '/img/plus.svg'}
				/>
			</button>
		</div>
		<div
			class=" w-full h-[72px] flex justify-between items-center px-6 flip-box-back bg-[#f7f7f7] border-[1px] border-[#d1d1d1] rounded-2xl"
		>
			<div class="flex items-center">
				<div class="scheduled-item__text">{event.title}</div>
				<div class="scheduled-item__date">
					<span>{formattedDate}</span>
				</div>
				<div class="scheduled-item__period">
					<span>Yearly</span>
				</div>
				<div class=" ml-3 rounded bg-[#959595] text-white uppercase text-xs leading-none px-2 py-1">
					SCHEDULED
				</div>
			</div>
			<button
				class="w-8 h-8 rounded-full cursor-pointer flex justify-center items-center my-auto text-[#959595] hover:text-black"
				title="Delete reminder"
				on:click={removeEvent}
				on:pointerover={() => {
					hover = true;
				}}
				on:pointerleave={() => {
					hover = false;
				}}
			>
				<img
					alt="Delete Event"
					class=" w-4 h-4"
					src={hover ? '/img/minus-black.svg' : '/img/minus.svg'}
				/>
			</button>
		</div>
	</div>
</div>

<div class="mb-4 relative md:hidden flip-box w-full h-[206px]">
	<div class=" w-full h-full  relative flip-box-inner" class:show-back={event.selected}>
		<div
			class=" px-6 py-5 bg-white rounded-2xl shadow-lg flip-box-front flex flex-col justify-center"
		>
			<h2 class="text-center text-base">
				{event.title}
			</h2>
			<p class="text-center text-sm mt-3">
				{formattedDate}
			</p>
			<div class="w-full flex items-center justify-center mx-auto my-6">
				<span>Yearly</span>
			</div>
			<div
				class="text-center rounded-md border-2 border-[#d1d1d1] p-3 text-[#959595] font-semibold leading-none cursor-pointer"
				on:click|stopPropagation={addEvent}
			>
				Schedule
			</div>
		</div>

		<div
			class="px-6 py-5 bg-[#f7f7f7] border-[1px] border-[#d1d1d1] rounded-2xl shadow-lg flip-box-back flex flex-col justify-center"
		>
			<h2 class="text-center text-base">
				{event.title}
			</h2>
			<p class="text-center text-sm mt-3">
				{formattedDate}
			</p>
			<div class="w-full flex items-center justify-center mx-auto my-6">
				<span>Yearly</span>
			</div>
			<div
				class="text-center rounded-md border-2 border-[#d1d1d1] p-3 text-[#959595] font-semibold leading-none cursor-pointer"
				on:click|stopPropagation={removeEvent}
			>
				Unschedule
			</div>
		</div>
	</div>
</div>

<style>
	/* FLIPBOX */

	/* The flip box container - set the width and height to whatever you want. We have added the border property to demonstrate that the flip itself goes out of the box on hover (remove perspective if you don't want the 3D effect */
	.flip-box {
		perspective: 1000px; /* Remove this if you don't want the 3D effect */
	}

	/* This container is needed to position the front and back side */
	.flip-box-inner {
		transition: transform 0.8s;
		transform-style: preserve-3d;
	}

	/* Do an horizontal flip when you move the mouse over the flip box container */
	.show-back {
		transform: rotateX(180deg);
	}

	/* Position the front and back side */
	.flip-box-front,
	.flip-box-back {
		position: absolute;
		width: 100%;
		height: 100%;
		-webkit-backface-visibility: hidden; /* Safari */
		backface-visibility: hidden;
	}

	.flip-box-back {
		transform: rotateX(180deg);
	}
</style>
