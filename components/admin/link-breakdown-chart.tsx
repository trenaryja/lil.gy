'use client'

import { SankeyChart } from '@/components/ui/charts/sankey-chart'
import type { LinkBreakdownItem } from '@/types'
import { buildSankey, isSankeyError } from '@/utils/sankey'
import { RadioGroup } from '@trenaryja/ui'
import { useState } from 'react'
import type { Dimension } from './dimension-selector'
import { DimensionSelector } from './dimension-selector'

const DIMENSIONS: Dimension[] = [
	{ id: 'authStatus', label: 'Auth' },
	{ id: 'slugType', label: 'Slug Type' },
	{ id: 'activityStatus', label: 'Active Status' },
]

export type MetricType = 'clicks' | 'links'

type LinkBreakdownChartProps = {
	data: LinkBreakdownItem[]
}

export const LinkBreakdownChart = ({ data }: LinkBreakdownChartProps) => {
	const [dimensionOrder, setDimensionOrder] = useState(['authStatus', 'slugType'])
	const [metricType, setMetricType] = useState<MetricType>('links')

	const getValue = (item: LinkBreakdownItem) => (metricType === 'links' ? item.linkCount : item.clickCount)

	const buildPath = (item: LinkBreakdownItem): string[] => [
		'All Links',
		...dimensionOrder.map((dim) => item[dim as keyof LinkBreakdownItem] as string),
	]

	const filteredItems = data.filter((item) => getValue(item) > 0)
	const sankeyResult = buildSankey(filteredItems, buildPath, getValue)

	if (isSankeyError(sankeyResult) || filteredItems.length === 0) {
		return (
			<div className='h-64 flex items-center justify-center opacity-60'>
				<p>No link data available</p>
			</div>
		)
	}

	return (
		<div className='grid gap-4 place-items-center'>
			<div className='flex flex-wrap gap-4 items-center justify-center'>
				<DimensionSelector
					dimensions={DIMENSIONS}
					selectedIds={dimensionOrder}
					onChange={setDimensionOrder}
					minSelected={2}
				/>
				<RadioGroup
					variant='btn'
					options={[
						{ value: 'links', label: 'Links' },
						{ value: 'clicks', label: 'Clicks' },
					]}
					value={metricType}
					onChange={(e) => setMetricType(e.target.value as MetricType)}
					classNames={{ container: 'join', item: 'join-item btn-sm' }}
				/>
			</div>
			<SankeyChart data={sankeyResult} emptyMessage='No link data available' />
		</div>
	)
}
