import { getMyLinks } from '@/actions'
import { CreateLinkForm, LinkCard } from '@/components'

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
		<main className='full-bleed-container gap-4 content-start grid-rows-[auto_1fr]'>
			<div className='surface p-4 grid gap-2'>
				<h2 className='font-black'>Create New Link</h2>
				<CreateLinkForm />
			</div>

			{links.length === 0 ? (
				<div className='prose text-center place-self-center'>
					<h2>No links yet</h2>
					<span>Create your first one above</span>
				</div>
			) : (
				<div className='grid content-start gap-4'>
					{links.map((link) => (
						<LinkCard key={link.id} link={link} />
					))}
				</div>
			)}
		</main>
	)
}

export default DashboardPage
