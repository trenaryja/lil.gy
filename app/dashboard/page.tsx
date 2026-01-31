import { getMyLinks } from '@/actions'
import { CreateLinkForm } from '@/components'
import { LinkCard } from './components/link-card'

const DashboardPage = async () => {
	const result = await getMyLinks()

	if (!result.success)
		return (
			<div className='alert alert-error'>
				<span>{result.error}</span>
			</div>
		)

	const links = result.data

	return (
		<main className='grid gap-4'>
			<div className='surface p-4 grid gap-2'>
				<h2 className='font-black'>Create New Link</h2>
				<CreateLinkForm />
			</div>

			{links.length === 0 ? (
				<div className='surface'>
					<div className='card-body text-center py-12'>
						<p className='opacity-70'>No links yet. Create your first one above!</p>
					</div>
				</div>
			) : (
				<div className='flex flex-col gap-2'>
					{links.map((link) => (
						<LinkCard key={link.id} link={link} />
					))}
				</div>
			)}
		</main>
	)
}

export default DashboardPage
