import { CurrentTime } from './client'

export default async function Home() {
	return (
		<main className='grid place-items-center content-center gap-4 h-screen'>
			<h1 className='text-9xl'>Hello World</h1>
			<CurrentTime />
		</main>
	)
}
