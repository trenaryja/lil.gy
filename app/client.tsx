'use client'

import { useEffect, useState } from 'react'

export const CurrentTime = () => {
	const [time, setTime] = useState(new Date())

	useEffect(() => {
		const t = setInterval(() => setTime(new Date()), 1000)
		return () => clearInterval(t)
	}, [])

	return <p>{time.toLocaleTimeString()}</p>
}
