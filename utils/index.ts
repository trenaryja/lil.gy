export * from './rate-limit'
export * from './slug-generator'
export * from './validators'

export const noop = () => {
	/* empty */
}

export const getToday = () => {
	const today = new Date()
	today.setHours(0, 0, 0, 0)
	return today
}
