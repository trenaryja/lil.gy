export type LinkBreakdownItem = {
	authStatus: 'anonymous' | 'owned'
	slugType: 'custom' | 'generated'
	activityStatus: 'active' | 'inactive'
	linkCount: number
	clickCount: number
}
