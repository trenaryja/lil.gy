'use client'

import { format, parseISO } from 'date-fns'
import { Area, AreaChart as RechartsAreaChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'

type AreaChartProps<T extends Record<string, unknown>> = {
	data: T[]
	xKey: string & keyof T
	yKey: string & keyof T
	emptyMessage?: string
	xType?: 'date' | 'string' // 'date' will format ISO strings as "MMM d"
	valueLabel?: string // e.g., "click" for "5 clicks"
}

export const AreaChart = <T extends Record<string, unknown>>({
	data,
	xKey,
	yKey,
	emptyMessage = 'No data available',
	xType = 'string',
	valueLabel,
}: AreaChartProps<T>) => {
	const formatX = xType === 'date' ? (value: string) => format(parseISO(value), 'MMM d') : undefined
	const formatXFull = xType === 'date' ? (value: string) => format(parseISO(value), 'MMM d, yyyy') : undefined

	if (data.length === 0) {
		return (
			<div className='h-64 flex items-center justify-center opacity-60'>
				<p>{emptyMessage}</p>
			</div>
		)
	}

	const total = data.reduce((sum, d) => sum + (Number(d[yKey]) || 0), 0)

	if (total === 0) {
		return (
			<div className='h-64 flex items-center justify-center opacity-60'>
				<p>{emptyMessage}</p>
			</div>
		)
	}

	const gradientId = `areaGradient-${xKey}-${yKey}`

	return (
		<div className='h-64 w-full'>
			<ResponsiveContainer width='100%' height='100%'>
				<RechartsAreaChart data={data} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
					<defs>
						<linearGradient id={gradientId} x1='0' y1='0' x2='0' y2='1'>
							<stop offset='5%' stopColor='oklch(var(--p))' stopOpacity={0.3} />
							<stop offset='95%' stopColor='oklch(var(--p))' stopOpacity={0} />
						</linearGradient>
					</defs>
					<XAxis
						dataKey={xKey}
						tickFormatter={formatX}
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
							if (active && payload && payload.length) {
								const value = payload[0].value as number
								const formattedLabel = formatXFull && typeof label === 'string' ? formatXFull(label) : label
								const labelText = valueLabel ? `${value} ${valueLabel}${value !== 1 ? 's' : ''}` : String(value)

								return (
									<div className='bg-base-300 px-3 py-2 rounded-lg shadow-lg'>
										<p className='text-sm opacity-70'>{formattedLabel}</p>
										<p className='font-bold'>{labelText}</p>
									</div>
								)
							}

							return null
						}}
					/>
					<Area
						type='monotone'
						dataKey={yKey}
						stroke='oklch(var(--p))'
						fillOpacity={1}
						fill={`url(#${gradientId})`}
						strokeWidth={2}
					/>
				</RechartsAreaChart>
			</ResponsiveContainer>
		</div>
	)
}
