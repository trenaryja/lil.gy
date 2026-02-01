'use client'

import type { ComponentProps, ReactNode } from 'react'
import { useState } from 'react'

export type ConfirmButtonProps = Omit<ComponentProps<'button'>, 'onClick'> & {
	onConfirm: () => void
	confirmChildren?: ReactNode
	confirmClassName?: string
	timeout?: number
}

export const ConfirmButton = ({
	children,
	confirmChildren,
	confirmClassName,
	onConfirm,
	className,
	timeout = 3000,
	...props
}: ConfirmButtonProps) => {
	const [pending, setPending] = useState(false)

	const handleClick = () => {
		if (!pending) {
			setPending(true)
			setTimeout(() => setPending(false), timeout)
		} else {
			onConfirm()
			setPending(false)
		}
	}

	return (
		<button
			type='button'
			className={pending && confirmClassName ? confirmClassName : className}
			onClick={handleClick}
			{...props}
		>
			{pending ? (confirmChildren ?? children) : children}
		</button>
	)
}

// TODO: move to @trenaryja/ui
