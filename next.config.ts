import type { NextConfig } from 'next'
import './env' // validates at dev/build start, so a bad var fails here rather than on the first admin request

const nextConfig: NextConfig = {
	images: {
		remotePatterns: [
			{
				protocol: 'https',
				hostname: 'workoscdn.com',
			},
		],
	},
}

export default nextConfig
