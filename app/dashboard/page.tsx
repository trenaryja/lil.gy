import { getMyLinks } from '@/lib/actions/links'
import { LinkCard } from './components/link-card'
import { CreateLinkForm } from '@/components/create-link-form'

export default async function DashboardPage() {
	const result = await getMyLinks()

	if (!result.success) {
		return (
			<div className='alert alert-error'>
				<span>{result.error}</span>
			</div>
		)
	}

	const links = result.data

	return (
		<div className='max-w-4xl mx-auto space-y-8'>
			<div>
				<h1 className='text-3xl font-bold mb-2'>My Links</h1>
				<p className='opacity-70'>Create and manage your shortened URLs</p>
			</div>

			<div className='card bg-base-200'>
				<div className='card-body'>
					<h2 className='card-title text-lg'>Create New Link</h2>
					<CreateLinkForm />
				</div>
			</div>

			<div className='space-y-4'>
				<h2 className='text-xl font-semibold'>Your Links ({links.length})</h2>

				{links.length === 0 ? (
					<div className='card bg-base-200'>
						<div className='card-body text-center py-12'>
							<p className='opacity-70'>No links yet. Create your first one above!</p>
						</div>
					</div>
				) : (
					<div className='space-y-4'>
						{links.map((link) => (
							<LinkCard key={link.id} link={link} />
						))}
					</div>
				)}
			</div>
		</div>
	)
}
