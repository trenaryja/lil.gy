'use client'

import { getAllUsers } from '@/actions'
import { UserDetailModal } from '@/components/admin'
import { useCallback, useEffect, useState, useTransition } from 'react'

type User = {
	userId: string
	linkCount: number
	totalClicks: number
}

const AdminUsersPage = () => {
	const [users, setUsers] = useState<User[]>([])
	const [error, setError] = useState<string | null>(null)
	const [isPending, startTransition] = useTransition()
	const [selectedUserId, setSelectedUserId] = useState<string | null>(null)

	useEffect(() => {
		startTransition(async () => {
			const result = await getAllUsers()

			if (result.success) setUsers(result.data)
			else setError(result.error)
		})
	}, [])

	const handleUserClick = useCallback((userId: string) => {
		setSelectedUserId(userId)
	}, [])

	const handleCloseModal = useCallback(() => {
		setSelectedUserId(null)
	}, [])

	if (error)
		return (
			<div className='alert alert-error'>
				<span>{error}</span>
			</div>
		)

	if (isPending)
		return (
			<div className='flex justify-center py-12'>
				<span className='loading loading-spinner loading-lg' />
			</div>
		)

	return (
		<>
			<section id='users' className='scroll-mt-24'>
				<div className='mb-6'>
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
											<tr
												key={user.userId}
												className='cursor-pointer hover:bg-base-300/50 transition-colors'
												onClick={() => handleUserClick(user.userId)}
											>
												<td className='font-mono text-sm'>{user.userId}</td>
												<td className='text-right font-mono'>{user.linkCount}</td>
												<td className='text-right font-mono'>{user.totalClicks.toLocaleString()}</td>
												<td className='text-right'>
													<button type='button' className='btn btn-ghost btn-xs'>
														View
													</button>
												</td>
											</tr>
										))}
									</tbody>
								</table>
							</div>
						</div>
					</div>
				)}
			</section>

			<UserDetailModal userId={selectedUserId} onClose={handleCloseModal} />
		</>
	)
}

export default AdminUsersPage
