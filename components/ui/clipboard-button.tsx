'use client'

import { useClipboard } from '@mantine/hooks'
import type { ComponentProps, ReactNode } from 'react'
import { LuCheck, LuCopy } from 'react-icons/lu'

const DefaultIcon = <LuCopy />
const DefaultCopiedIcon = <LuCheck className='text-success' />

export type ClipboardButtonProps = Omit<ComponentProps<'button'>, 'onClick'> & {
	copy: string
	copiedChildren?: ReactNode
	copiedClassName?: string
	timeout?: number
}

export const ClipboardButton = ({
	children = DefaultIcon,
	copiedChildren = DefaultCopiedIcon,
	copiedClassName,
	copy,
	className,
	timeout = 2000,
	...props
}: ClipboardButtonProps) => {
	const clipboard = useClipboard({ timeout })

	return (
		<button
			type='button'
			className={clipboard.copied && copiedClassName ? copiedClassName : className}
			onClick={() => clipboard.copy(copy)}
			{...props}
		>
			{clipboard.copied ? copiedChildren : children}
		</button>
	)
}

// TODO: move to @trenaryja/ui
