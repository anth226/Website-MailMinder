export const eventRepeatToDB = (label) => {
	switch (label) {
		case 'Never':
			return 'never';

		case 'Daily':
			return 'day';

		case 'Weekly':
			return 'week';

		case 'Monthly':
			return 'month';

		case 'Quarterly':
			return 'quarter';

		case 'Yearly':
			return 'year';
	}
};

export const eventRepeatToLabel = (repeat) => {
	switch (repeat) {
		case 'never':
			return 'Never';

		case 'day':
			return 'Daily';

		case 'week':
			return 'Weekly';

		case 'month':
			return 'Monthly';

		case 'quarter':
			return 'Quarterly';

		case 'year':
			return 'Yearly';
	}
};
