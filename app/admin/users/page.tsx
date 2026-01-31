import Link from 'next/link'
import { getAllUsers } from '@/actions'

export default async function AdminUsersPage() {
	const result = await getAllUsers()

	if (!result.success) {
		return (
			<div className='alert alert-error'>
				<span>{result.error}</span>
			</div>
		)
	}

	const users = result.data

	return (
		<div className='space-y-8'>
			<div>
				<h1 className='text-2xl font-bold'>Users</h1>
				<p className='opacity-70'>{users.length} users with links</p>
			</div>

			{users.length === 0 ? (
				<div className='text-center py-12 opacity-60'>
					<p>No users with links yet</p>
				</div>
			) : (
				<div className='card bg-base-200'>
					<div className='card-body'>
						<div className='overflow-x-auto'>
							<table className='table table-zebra'>
								<thead>
									<tr>
										<th>User ID</th>
										<th className='text-right'>Links</th>
										<th className='text-right'>Total Clicks</th>
										<th />
									</tr>
								</thead>
								<tbody>
									{users.map((user) => (
										<tr key={user.userId}>
											<td className='font-mono text-sm'>{user.userId}</td>
											<td className='text-right font-mono'>{user.linkCount}</td>
											<td className='text-right font-mono'>{user.totalClicks.toLocaleString()}</td>
											<td className='text-right'>
												<Link href={`/admin/users/${encodeURIComponent(user.userId)}`} className='btn btn-ghost btn-xs'>
													View
												</Link>
											</td>
										</tr>
									))}
								</tbody>
							</table>
						</div>
					</div>
				</div>
			)}
		</div>
	)
}
