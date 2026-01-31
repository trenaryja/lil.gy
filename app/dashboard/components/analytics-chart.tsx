'use client'

import { Area, AreaChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'
import { format, parseISO } from 'date-fns'

type AnalyticsChartProps = {
	data: { date: string; clicks: number }[]
}

export const AnalyticsChart = ({ data }: AnalyticsChartProps) => {
	if (data.length === 0) {
		return (
			<div className='h-64 flex items-center justify-center opacity-60'>
				<p>No click data available</p>
			</div>
		)
	}

	const totalClicks = data.reduce((sum, d) => sum + d.clicks, 0)

	if (totalClicks === 0) {
		return (
			<div className='h-64 flex items-center justify-center opacity-60'>
				<p>No clicks in the last 30 days</p>
			</div>
		)
	}

	return (
		<div className='h-64 w-full'>
			<ResponsiveContainer width='100%' height='100%'>
				<AreaChart data={data} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
					<defs>
						<linearGradient id='colorClicks' x1='0' y1='0' x2='0' y2='1'>
							<stop offset='5%' stopColor='oklch(var(--p))' stopOpacity={0.3} />
							<stop offset='95%' stopColor='oklch(var(--p))' stopOpacity={0} />
						</linearGradient>
					</defs>
					<XAxis
						dataKey='date'
						tickFormatter={(value) => format(parseISO(value), 'MMM d')}
						stroke='currentColor'
						opacity={0.5}
						fontSize={12}
						tickLine={false}
						axisLine={false}
					/>
					<YAxis
						stroke='currentColor'
						opacity={0.5}
						fontSize={12}
						tickLine={false}
						axisLine={false}
						allowDecimals={false}
					/>
					<Tooltip
						content={({ active, payload, label }) => {
							if (active && payload && payload.length && typeof label === 'string') {
								return (
									<div className='bg-base-300 px-3 py-2 rounded-lg shadow-lg'>
										<p className='text-sm opacity-70'>{format(parseISO(label), 'MMM d, yyyy')}</p>
										<p className='font-bold'>
											{payload[0].value} click{payload[0].value !== 1 ? 's' : ''}
										</p>
									</div>
								)
							}

							return null
						}}
					/>
					<Area
						type='monotone'
						dataKey='clicks'
						stroke='oklch(var(--p))'
						fillOpacity={1}
						fill='url(#colorClicks)'
						strokeWidth={2}
					/>
				</AreaChart>
			</ResponsiveContainer>
		</div>
	)
}
