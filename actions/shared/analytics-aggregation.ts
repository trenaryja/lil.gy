import { attempt } from '@trenaryja/ui/utils'

type ClickEvent = { timestamp: Date; country: string | null; referrer: string | null }

export const aggregateClicksByDay = (clicks: ClickEvent[], days: number): { date: string; clicks: number }[] => {
	const clicksByDayMap = new Map<string, number>()

	for (let i = days - 1; i >= 0; i--) {
		const date = new Date()
		date.setDate(date.getDate() - i)
		clicksByDayMap.set(date.toISOString().split('T')[0], 0)
	}

	clicks.forEach((click) => {
		const date = click.timestamp.toISOString().split('T')[0]
		if (clicksByDayMap.has(date)) clicksByDayMap.set(date, (clicksByDayMap.get(date) ?? 0) + 1)
	})

	return Array.from(clicksByDayMap.entries()).map(([date, count]) => ({ date, clicks: count }))
}

export const aggregateByCountry = (clicks: ClickEvent[], limit: number = 10): { country: string; clicks: number }[] => {
	const countryMap = new Map<string, number>()

	clicks.forEach((click) => {
		const country = click.country || 'Unknown'
		countryMap.set(country, (countryMap.get(country) ?? 0) + 1)
	})

	return Array.from(countryMap.entries())
		.map(([country, count]) => ({ country, clicks: count }))
		.sort((a, b) => b.clicks - a.clicks)
		.slice(0, limit)
}

export const aggregateByReferrer = (
	clicks: ClickEvent[],
	limit: number = 10,
): { referrer: string; clicks: number }[] => {
	const referrerMap = new Map<string, number>()

	clicks.forEach((click) => {
		const raw = click.referrer || 'Direct'
		const referrer = raw === 'Direct' ? raw : attempt(() => new URL(raw).hostname, { fallback: 'Direct' })
		referrerMap.set(referrer, (referrerMap.get(referrer) ?? 0) + 1)
	})

	return Array.from(referrerMap.entries())
		.map(([referrer, count]) => ({ referrer, clicks: count }))
		.sort((a, b) => b.clicks - a.clicks)
		.slice(0, limit)
}
