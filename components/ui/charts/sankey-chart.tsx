'use client'

import type { SankeyData } from '@/utils'
import { ResponsiveContainer, Sankey, Tooltip } from 'recharts'

type RechartsSankeyNode = {
	name: string
	count?: number
}

type RechartsSankeyLink = {
	source: number
	target: number
	value: number
}

type RechartsSankeyData = {
	nodes: RechartsSankeyNode[]
	links: RechartsSankeyLink[]
}

type ResolvedLink = {
	source: RechartsSankeyNode & { value: number }
	target: RechartsSankeyNode & { value: number }
	value: number
}

type TooltipPayload = {
	payload?: ResolvedLink
	name: string
	value: number
	count?: number
}

const isLinkPayload = (item: TooltipPayload): item is TooltipPayload & { payload: ResolvedLink } =>
	item.payload !== undefined && 'source' in item.payload && 'target' in item.payload

type SankeyChartProps = {
	data: SankeyData
	emptyMessage?: string
}

const toRechartsFormat = (data: SankeyData): RechartsSankeyData => {
	const nodeMap = new Map<string, number>()
	let index = 0

	for (const node of data.nodes) {
		nodeMap.set(node.id, index)
		index += 1
	}

	const nodes: RechartsSankeyNode[] = data.nodes.map((node) => ({
		name: node.id,
		count: node.value,
	}))

	const links: RechartsSankeyLink[] = data.links.map((link) => ({
		source: nodeMap.get(link.source) ?? 0,
		target: nodeMap.get(link.target) ?? 0,
		value: link.value,
	}))

	return { nodes, links }
}

export const SankeyChart = ({ data }: SankeyChartProps) => {
	if (!data || data.nodes.length === 0) return null

	const rechartsData = toRechartsFormat(data)

	return (
		<div className='h-64 w-full'>
			<ResponsiveContainer width='100%' height='100%'>
				<Sankey
					data={rechartsData}
					nodePadding={16}
					className='fill-primary stroke-primary'
					node={{ fill: 'inherit' }}
					link={{ stroke: 'inherit' }}
				>
					<Tooltip
						content={({ active, payload }) => {
							if (!active || !payload?.[0]) return null

							const item = payload[0].payload as TooltipPayload

							if (isLinkPayload(item)) {
								const { source, target } = item.payload
								return (
									<div className='stats grid-cols-2 shadow bg-base-200'>
										<div className='stat'>
											<div className='stat-title'>{source.name}</div>
											<div className='stat-value text-lg'>{source.count ?? source.value}</div>
										</div>
										<div className='stat'>
											<div className='stat-title'>{target.name}</div>
											<div className='stat-value text-lg'>{target.count ?? target.value}</div>
										</div>
									</div>
								)
							}

							return (
								<div className='stats shadow bg-base-200'>
									<div className='stat'>
										<div className='stat-title'>{item.name}</div>
										{item.payload?.value !== undefined && (
											<div className='stat-value text-lg'>{item.payload.value}</div>
										)}
									</div>
								</div>
							)
						}}
					/>
				</Sankey>
			</ResponsiveContainer>
		</div>
	)
}

// TODO: move to @trenaryja/ui
