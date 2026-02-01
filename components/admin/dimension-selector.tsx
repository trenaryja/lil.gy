'use client'

import type { DragEndEvent, DragStartEvent } from '@dnd-kit/core'
import { closestCenter, DndContext, DragOverlay, PointerSensor, useSensor, useSensors } from '@dnd-kit/core'
import { arrayMove, horizontalListSortingStrategy, SortableContext, useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { cn } from '@trenaryja/ui'
import { useState } from 'react'

export type Dimension = { id: string; label: string }

type DimensionSelectorProps = {
	dimensions: Dimension[]
	selectedIds: string[]
	onChange: (orderedIds: string[]) => void
	minSelected?: number
}

type AnimationState = { id: string; phase: 'in' | 'out' } | null

const DimensionButton = ({
	dimension,
	isSelected,
	isOverlay,
	animationPhase,
	disabled,
	onClick,
	onAnimationEnd,
}: {
	dimension: Dimension
	isSelected?: boolean
	isOverlay?: boolean
	animationPhase?: 'in' | 'out'
	disabled?: boolean
	onClick?: () => void
	onAnimationEnd?: () => void
}) => {
	const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
		id: dimension.id,
		disabled: !isSelected || isOverlay,
	})

	if (isOverlay) return <span className='btn btn-sm btn-primary shadow-lg'>{dimension.label}</span>

	return (
		<button
			ref={isSelected ? setNodeRef : undefined}
			style={isSelected ? { transform: CSS.Transform.toString(transform), transition } : undefined}
			{...(isSelected ? { ...attributes, ...listeners } : {})}
			type='button'
			disabled={disabled}
			onClick={(e) => {
				if (isDragging) return
				e.stopPropagation()
				onClick?.()
			}}
			onAnimationEnd={onAnimationEnd}
			className={cn(
				'btn btn-sm',
				isSelected ? 'btn-primary' : 'btn-ghost',
				isDragging && 'opacity-0',
				animationPhase === 'out' && 'animate-out fade-out zoom-out-95',
				animationPhase === 'in' && 'animate-in fade-in zoom-in-95',
				disabled && 'btn-disabled',
			)}
		>
			{dimension.label}
		</button>
	)
}

export const DimensionSelector = ({ dimensions, selectedIds, onChange, minSelected = 2 }: DimensionSelectorProps) => {
	const [activeId, setActiveId] = useState<string | null>(null)
	const [animation, setAnimation] = useState<AnimationState>(null)
	const sensors = useSensors(useSensor(PointerSensor, { activationConstraint: { distance: 5 } }))

	const dimensionMap = new Map(dimensions.map((d) => [d.id, d]))
	const selected = selectedIds.flatMap((id) => dimensionMap.get(id) ?? [])
	const available = dimensions.filter((d) => !selectedIds.includes(d.id))

	const getAnimationPhase = (id: string) => (animation?.id === id ? animation.phase : undefined)

	const handleDragStart = ({ active }: DragStartEvent) => setActiveId(active.id as string)

	const handleDragEnd = ({ active, over }: DragEndEvent) => {
		setActiveId(null)
		if (!over || active.id === over.id) return
		const oldIndex = selectedIds.indexOf(active.id as string)
		const newIndex = selectedIds.indexOf(over.id as string)
		if (oldIndex !== -1 && newIndex !== -1) onChange(arrayMove(selectedIds, oldIndex, newIndex))
	}

	const handleClick = (id: string) => {
		if (selectedIds.includes(id) && selectedIds.length <= minSelected) return
		setAnimation({ id, phase: 'out' })
	}

	const handleAnimationEnd = (id: string) => {
		if (animation?.id !== id) return
		if (animation.phase === 'out') {
			onChange(selectedIds.includes(id) ? selectedIds.filter((sid) => sid !== id) : [...selectedIds, id])
			setAnimation({ id, phase: 'in' })
		} else {
			setAnimation(null)
		}
	}

	return (
		<DndContext
			sensors={sensors}
			collisionDetection={closestCenter}
			onDragStart={handleDragStart}
			onDragEnd={handleDragEnd}
		>
			<div className='flex gap-2'>
				<SortableContext items={selectedIds} strategy={horizontalListSortingStrategy}>
					<div className='flex flex-wrap gap-2'>
						{selected.map((d) => (
							<DimensionButton
								key={d.id}
								dimension={d}
								isSelected
								animationPhase={getAnimationPhase(d.id)}
								disabled={selectedIds.length <= minSelected}
								onClick={() => handleClick(d.id)}
								onAnimationEnd={() => handleAnimationEnd(d.id)}
							/>
						))}
					</div>
				</SortableContext>

				{available.length > 0 && (
					<div className='flex flex-wrap gap-2'>
						{available.map((d) => (
							<DimensionButton
								key={d.id}
								dimension={d}
								animationPhase={getAnimationPhase(d.id)}
								onClick={() => handleClick(d.id)}
								onAnimationEnd={() => handleAnimationEnd(d.id)}
							/>
						))}
					</div>
				)}
			</div>

			<DragOverlay>
				{activeId && dimensionMap.get(activeId) && (
					<DimensionButton dimension={dimensionMap.get(activeId)!} isOverlay />
				)}
			</DragOverlay>
		</DndContext>
	)
}
