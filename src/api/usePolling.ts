import * as React from 'react'

type PollingCallback = () => Promise<void>
type PollAction = (reset?: boolean) => void
type Action = () => void

export function usePolling(callback: PollingCallback, timeoutMs: number, shouldRun: boolean = false) {
	const timeoutIdRef = React.useRef<NodeJS.Timeout>()
	const callbackRef = React.useRef<PollingCallback>(() => Promise.resolve())
	const timeoutMsRef = React.useRef(timeoutMs)
	const start = React.useRef<PollAction>(() => { /* do nothing */ })
	const stop = React.useRef<Action>(() => { /* do nothing */ })

	React.useEffect(() => {
		callbackRef.current = callback
	}, [callback])

	React.useEffect(() => {
		timeoutMsRef.current = timeoutMs
	}, [timeoutMs])

	React.useEffect(() => {
		let pollingStopped = false
		async function poll(reset?: boolean) {
			if (reset) {
				pollingStopped = false
			}
			await callbackRef.current()
			if (!pollingStopped) {
				timeoutIdRef.current = setTimeout(() => poll(), timeoutMsRef.current)
			}
		}

		function stopPolling() {
			if (timeoutIdRef.current) {
				clearTimeout(timeoutIdRef.current)
			}

			timeoutIdRef.current = undefined
			pollingStopped = true
		}

		start.current = poll
		stop.current = stopPolling

		return stopPolling
	}, [callbackRef, timeoutIdRef, timeoutMsRef])

	React.useEffect(() => {
		shouldRun ? start.current(true) : stop.current()
	}, [shouldRun])
}