import Link from 'next/link'

type Column<T extends object> = {
	key: string | keyof T
	header: string
	render?: (item: T) => React.ReactNode
	className?: string
}

type DataTableProps<T extends object> = {
	columns: Column<T>[]
	data: T[]
	keyField: keyof T
	emptyMessage?: string
}

export const DataTable = <T extends object>({
	columns,
	data,
	keyField,
	emptyMessage = 'No data available',
}: DataTableProps<T>) => {
	if (data.length === 0) {
		return (
			<div className='text-center py-8 opacity-60'>
				<p>{emptyMessage}</p>
			</div>
		)
	}

	return (
		<div className='overflow-x-auto'>
			<table className='table table-zebra'>
				<thead>
					<tr>
						{columns.map((col) => (
							<th key={String(col.key)} className={col.className}>
								{col.header}
							</th>
						))}
					</tr>
				</thead>
				<tbody>
					{data.map((item) => (
						<tr key={String(item[keyField])}>
							{columns.map((col) => (
								<td key={String(col.key)} className={col.className}>
									{col.render ? col.render(item) : String(col.key in item ? item[col.key as keyof T] : '')}
								</td>
							))}
						</tr>
					))}
				</tbody>
			</table>
		</div>
	)
}

type LinkItem = {
	id: string
	slug: string
	url: string
	clicks: number
	isActive: boolean
	createdAt: Date
}

export const LinkTable = ({ links }: { links: LinkItem[] }) => {
	const columns: Column<LinkItem>[] = [
		{
			key: 'slug',
			header: 'Slug',
			render: (link) => (
				<Link href={`https://lil.gy/${link.slug}`} target='_blank' className='link link-primary font-mono'>
					/{link.slug}
				</Link>
			),
		},
		{
			key: 'url',
			header: 'Destination',
			render: (link) => (
				<span className='max-w-xs truncate block' title={link.url}>
					{link.url}
				</span>
			),
		},
		{
			key: 'clicks',
			header: 'Clicks',
			className: 'text-right',
			render: (link) => <span className='font-mono'>{link.clicks.toLocaleString()}</span>,
		},
		{
			key: 'isActive',
			header: 'Status',
			render: (link) => (
				<span className={`badge badge-sm ${link.isActive ? 'badge-success' : 'badge-error'}`}>
					{link.isActive ? 'Active' : 'Inactive'}
				</span>
			),
		},
		{
			key: 'createdAt',
			header: 'Created',
			render: (link) => <span className='text-sm opacity-70'>{link.createdAt.toLocaleDateString()}</span>,
		},
	]

	return <DataTable columns={columns} data={links} keyField='id' emptyMessage='No links found' />
}
