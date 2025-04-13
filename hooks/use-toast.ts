// Inspired by react-hot-toast library
import * as React from 'react'

import type { ToastActionElement, ToastProps } from '@/components/ui/toast'

const TOAST_LIMIT = 1
const TOAST_REMOVE_DELAY = 1000000

type ToasterToast = ToastProps & {
  id: string
  title?: React.ReactNode
  description?: React.ReactNode
  action?: ToastActionElement
}

// ACTION 타입 정의
const ACTION_TYPES = {
  ADD_TOAST: 'ADD_TOAST',
  UPDATE_TOAST: 'UPDATE_TOAST',
  DISMISS_TOAST: 'DISMISS_TOAST',
  REMOVE_TOAST: 'REMOVE_TOAST'
} as const

const counter = {
  value: 0,
  next: function () {
    this.value = (this.value + 1) % Number.MAX_SAFE_INTEGER

    return this.value.toString()
  }
}

function genId() {
  return counter.next()
}

type Action =
  | {
      type: typeof ACTION_TYPES.ADD_TOAST
      toast: ToasterToast
    }
  | {
      type: typeof ACTION_TYPES.UPDATE_TOAST
      toast: Partial<ToasterToast>
    }
  | {
      type: typeof ACTION_TYPES.DISMISS_TOAST
      toastId?: ToasterToast['id']
    }
  | {
      type: typeof ACTION_TYPES.REMOVE_TOAST
      toastId?: ToasterToast['id']
    }

type State = {
  toasts: ToasterToast[]
}

const toastTimeouts = new Map<string, ReturnType<typeof setTimeout>>()

const addToRemoveQueue = (toastId: string) => {
  if (toastTimeouts.has(toastId)) {
    return
  }

  const timeout = setTimeout(() => {
    toastTimeouts.delete(toastId)
    dispatch({
      type: ACTION_TYPES.REMOVE_TOAST,
      toastId: toastId
    })
  }, TOAST_REMOVE_DELAY)

  toastTimeouts.set(toastId, timeout)
}

export const reducer = (state: State, action: Action): State => {
  if (action.type === ACTION_TYPES.ADD_TOAST) {
    return {
      ...state,
      toasts: [action.toast, ...state.toasts].slice(0, TOAST_LIMIT)
    }
  }

  if (action.type === ACTION_TYPES.UPDATE_TOAST) {
    return {
      ...state,
      toasts: state.toasts.map((t) => {
        if (t.id === action.toast.id) {
          return { ...t, ...action.toast }
        }

        return t
      })
    }
  }

  if (action.type === ACTION_TYPES.DISMISS_TOAST) {
    const { toastId } = action

    // ! Side effects ! - This could be extracted into a dismissToast() action,
    // but I'll keep it here for simplicity
    if (!toastId) {
      state.toasts.forEach((t) => {
        addToRemoveQueue(t.id)
      })

      return {
        ...state,
        toasts: state.toasts.map((t) => ({
          ...t,
          open: false
        }))
      }
    }

    addToRemoveQueue(toastId)

    return {
      ...state,
      toasts: state.toasts.map((t) => {
        if (t.id === toastId) {
          return {
            ...t,
            open: false
          }
        }

        return t
      })
    }
  }

  if (action.type === ACTION_TYPES.REMOVE_TOAST) {
    if (action.toastId === undefined) {
      return {
        ...state,
        toasts: []
      }
    }

    return {
      ...state,
      toasts: state.toasts.filter((t) => t.id !== action.toastId)
    }
  }

  return state
}

const listeners: Array<(state: State) => void> = []

const memoryState: State = { toasts: [] }

function dispatch(action: Action) {
  const newState = reducer(memoryState, action)

  // 상태 업데이트
  memoryState.toasts = [...newState.toasts]

  listeners.forEach((listener) => {
    listener(memoryState)
  })
}

type Toast = Omit<ToasterToast, 'id'>

function toast({ ...toastProps }: Toast) {
  const id = genId()

  const update = (updateProps: ToasterToast) =>
    dispatch({
      type: ACTION_TYPES.UPDATE_TOAST,
      toast: { ...updateProps, id }
    })
  const dismiss = () =>
    dispatch({ type: ACTION_TYPES.DISMISS_TOAST, toastId: id })

  dispatch({
    type: ACTION_TYPES.ADD_TOAST,
    toast: {
      ...toastProps,
      id,
      open: true,
      onOpenChange: (isOpen) => {
        if (!isOpen) dismiss()
      }
    }
  })

  return {
    id: id,
    dismiss,
    update
  }
}

function useToast() {
  const [state, setState] = React.useState<State>(memoryState)

  React.useEffect(() => {
    // listeners 배열을 직접 변경하지 않고 새로운 배열 생성하여 할당
    listeners[listeners.length] = setState

    return () => {
      // 리스너 제거 - 필터로 새 배열 생성
      const filteredListeners = listeners.filter(
        (listener) => listener !== setState
      )

      // 원본 리스너 배열 비우기
      listeners.length = 0

      // 필터링된 리스너들을 원본 배열에 복사
      filteredListeners.forEach((listener, index) => {
        listeners[index] = listener
      })
    }
  }, [state])

  return {
    ...state,
    toast,
    dismiss: (toastId?: string) =>
      dispatch({ type: ACTION_TYPES.DISMISS_TOAST, toastId })
  }
}

export { useToast, toast }
