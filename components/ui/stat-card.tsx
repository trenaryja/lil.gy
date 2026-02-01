type StatCardProps = {
	title: string
	value: number | string
	description?: string
	trend?: 'down' | 'neutral' | 'up'
}

export const StatCard = ({ title, value, description, trend }: StatCardProps) => {
	return (
		<div className='stat bg-base-200 rounded-box'>
			<div className='stat-title'>{title}</div>
			<div className='stat-value text-2xl md:text-3xl'>{value.toLocaleString()}</div>
			{description && (
				<div className='stat-desc flex items-center gap-1'>
					{trend === 'up' && <span className='text-success'>+</span>}
					{trend === 'down' && <span className='text-error'>-</span>}
					{description}
				</div>
			)}
		</div>
	)
}
