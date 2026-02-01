type NodeId = string

const EMPTY_NEIGHBORS: readonly NodeId[] = []

export type SankeyNode = {
	id: NodeId
	value: number
}

export type SankeyLink = {
	source: NodeId
	target: NodeId
	value: number
}

export type SankeyData = {
	nodes: SankeyNode[]
	links: SankeyLink[]
}

type SankeyError = { type: 'cycleDetected'; path: NodeId[] } | { type: 'noData' }

type SankeyResult = SankeyData | SankeyError

export const isSankeyError = (result: SankeyResult): result is SankeyError => 'type' in result

const buildAdjacency = (links: readonly SankeyLink[]): Map<NodeId, NodeId[]> => {
	const adjacency = new Map<NodeId, NodeId[]>()

	for (const { source, target } of links) {
		const neighbors = adjacency.get(source)
		if (neighbors) neighbors.push(target)
		else adjacency.set(source, [target])
	}

	return adjacency
}

const findCycle = (links: readonly SankeyLink[]): NodeId[] | null => {
	const adjacency = buildAdjacency(links)
	const visited = new Set<NodeId>()
	const path: NodeId[] = []
	const pathIndices = new Map<NodeId, number>()

	const traverseDepthFirst = (node: NodeId): NodeId[] | null => {
		visited.add(node)
		pathIndices.set(node, path.length)
		path.push(node)

		for (const neighbor of adjacency.get(node) ?? EMPTY_NEIGHBORS) {
			if (!visited.has(neighbor)) {
				const cycle = traverseDepthFirst(neighbor)
				if (cycle) return cycle
			} else {
				const cycleStart = pathIndices.get(neighbor)
				if (cycleStart !== undefined) return path.slice(cycleStart)
			}
		}

		path.pop()
		pathIndices.delete(node)
		return null
	}

	for (const [node] of adjacency) {
		if (!visited.has(node)) {
			const cycle = traverseDepthFirst(node)
			if (cycle) return cycle
		}
	}

	return null
}

export const buildSankey = <T>(
	data: readonly T[],
	extractPath: (item: T) => NodeId[],
	getValue: (item: T) => number = () => 1,
): SankeyResult => {
	if (data.length === 0) return { type: 'noData' }

	const linkMap = new Map<string, SankeyLink>()
	const nodeTotals = new Map<NodeId, number>()
	const addToTotal = (id: NodeId, value: number) => nodeTotals.set(id, (nodeTotals.get(id) ?? 0) + value)

	for (const item of data) {
		const path = extractPath(item)
		if (path.length < 2) continue

		const value = getValue(item)

		for (let i = 0; i < path.length - 1; i++) {
			const source = path[i]
			const target = path[i + 1]
			const key = `${source}|${target}`
			const existing = linkMap.get(key)

			if (existing) existing.value += value
			else linkMap.set(key, { source, target, value })

			addToTotal(source, value)
			addToTotal(target, value)
		}
	}

	if (linkMap.size === 0) return { type: 'noData' }

	const links = Array.from(linkMap.values())
	const cycle = findCycle(links)

	if (cycle) return { type: 'cycleDetected', path: cycle }
	return { nodes: Array.from(nodeTotals, ([id, value]) => ({ id, value })), links }
}
