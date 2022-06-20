/* PACKAGES */

import { writable, get, derived } from 'svelte/store';

/* STORES */

import { user } from './sessionStore';
import { countries } from '@constants/countries';

/* STORE VARS */

export const event = writable({});

export const events = writable([]);

export const commonEvents = derived(events, $events => {
	const temp = $events.filter((event) => {
		return event.common;
	})
	temp.sort((a, b) => {
		const d1 = new Date(a.date)
		const d2 = new Date(b.date)
		if (d1 < d2) {
			return -1
		}
		if (d1 > d2) return 1
		return 0

	})
	return temp
});

//console.log("COMMON EVENTS", $commonEvents)

export const holidays = writable([]);

export const holidaysInitialized = writable(false);

export const country = writable('');

export const isEditing = writable(false);

const baseUrl = import.meta.env.VITE_BACKEND_URL;

/* FUNCTIONS */

/* USERS */

export const getUsersCountry = async () => {
	try {
		const response = await fetch(`https://ip.uv.workers.dev/`);
		const result = await response.json();
		const findCountry = countries.find((country) => {
			return country.code === result.country;
		});
		country.set(findCountry.name);
		return result.country;
	} catch (error) {
		console.error(error);
	}
};

/* EVENTS */

export const fetchEvents = async () => {
	const $user = get(user);
	if ($user) {
		try {
			const response = await fetch(
				`${baseUrl}/event/findByUserIdAndEmail/${$user.id}/${$user.email}`
			);

			const rawResponse = await response.json();

			const fetchedEvents = rawResponse;

			events.set(fetchedEvents);
		} catch (error) {
			events.set([]);
			console.error(error);
		}
	}
};

export const insertEvent = async (data) => {
	try {
		const response = await fetch(`${baseUrl}/event`, {
			method: 'POST',
			body: JSON.stringify(data),
			headers: {
				'Content-Type': 'application/json'
			}
		});
		return await response.json();
	} catch (error) {
		console.error(error);
		return error;
	}
};

export const deleteEvent = async (id) => {
	try {
		const response = await fetch(`${baseUrl}/event/${id}`, {
			method: 'DELETE'
		});
		return await response.json();
	} catch (error) {
		console.error(error);
		return error;
	}
};

export const updateEvent = async (id, data) => {
	const finalData = Object.assign({}, data);

	delete finalData.uuid;
	delete finalData.created_at;
	delete finalData.updated_at;
	delete finalData.id;

	try {
		const response = await fetch(`${baseUrl}/event/${id}`, {
			method: 'PUT',
			body: JSON.stringify(finalData),
			headers: {
				'Content-Type': 'application/json'
			}
		});
		return await response.json();
	} catch (error) {
		console.error(error);
		return error;
	}
};

export const fetchHolidays = async (eventCountry) => {
	const $holidaysInitialized = get(holidaysInitialized);
	const $country = get(country);

	const countryObject = countries.find((country) => {
		return country.name === $country;
	});

	/* console.log(
		'CHECKING FETCH HOLIDAYS',
		countryObject.code,
		eventCountry,
		!$holidaysInitialized,
		countryObject.code !== eventCountry || !$holidaysInitialized
	); */

	if (countryObject.code !== eventCountry || !$holidaysInitialized) {
		/* const eventCountryObject = countries.find((country) => {
			return country.code === eventCountry;
		}); */

		//console.log('FETCHING HOLIDAYS', eventCountryObject);

		//country.set(eventCountryObject.name);

		holidaysInitialized.set(true);
		try {
			const response = await fetch(`${baseUrl}/holiday/${eventCountry}`);
			const temp = await response.json()
			temp.sort((a, b) => {
				const d1 = new Date(a.date)
				const d2 = new Date(b.date)
				if (d1 < d2) {
					return -1
				}
				if (d1 > d2) return 1
				return 0
			})
			holidays.set([
				...temp
				/* {
				date: '2022-05-05',
				localName: 'TEST EVENT',
				name: 'TEST EVENT',
				countryCode: 'CO',
				fixed: true,
				global: true,
				counties: null,
				launchYear: null,
				types: ['Public']
			} */
			]);
			//console.log(holidays)
		} catch (error) {
			holidays.set([]);
			console.error(error);
		}
	}
};

/* REMINDERS */

export const insertReminder = async (data) => {
	//console.log('CHECKING INSERT REMINDER', data);
	const { date, uuid, event_id, event_date, title } = data;

	// Remove email from reminder before creating
	/* if (uuid) {
		delete data.email;
	} */
	try {
		const response = await fetch(`${baseUrl}/reminder`, {
			method: 'POST',
			body: JSON.stringify({ uuid, date, email: data.email, event_id, event_date, title }),
			headers: {
				'Content-Type': 'application/json'
			}
		});

		return await response.json();
	} catch (error) {
		console.error(error);
		return error;
	}
};

export const deleteReminder = (id) => {
	try {
		const response = fetch(`${baseUrl}/reminder/${id}`, {
			method: 'DELETE'
		});
		return response.json();
	} catch (error) {
		console.error(error);
		return error;
	}
};

/* EMAIL */

export const sendEmail = async ({ email, event, test = false }) => {
	try {
		const response = await fetch(`${baseUrl}/email/sendOne`, {
			method: 'POST',
			body: JSON.stringify({ email, event: { ...event, date: event.event_date }, test }),
			headers: {
				'Content-Type': 'application/json'
			}
		});
		const result = await response.json();
		return result;
	} catch (error) {
		console.error(error);
		return false;
	}
};
