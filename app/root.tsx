import {
  isRouteErrorResponse,
  Links,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration
} from 'react-router'

import type { Route } from './+types/root'
import './app.css'

export const links: Route.LinksFunction = () => [
  { rel: 'preconnect', href: 'https://fonts.googleapis.com' },
  {
    rel: 'preconnect',
    href: 'https://fonts.gstatic.com',
    crossOrigin: 'anonymous'
  },
  {
    rel: 'stylesheet',
    href: 'https://fonts.googleapis.com/css2?family=Inter:ital,opsz,wght@0,14..32,100..900;1,14..32,100..900&display=swap'
  }
]

export function Layout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <Meta />
        <Links />
      </head>
      <body>
        {children}
        <ScrollRestoration />
        <Scripts />
      </body>
    </html>
  )
}

export default function App() {
  return <Outlet />
}

export function ErrorBoundary({ error }: Route.ErrorBoundaryProps) {
  // 기본 오류 메시지 설정
  const defaultMessage = 'Oops!'
  const defaultDetails = 'An unexpected error occurred.'

  // Route 오류 처리
  if (isRouteErrorResponse(error)) {
    return handleRouteError(error, defaultDetails)
  }

  // 개발 환경에서의 일반 오류 처리
  if (import.meta.env.DEV && error && error instanceof Error) {
    return renderErrorUI(defaultMessage, error.message, error.stack)
  }

  // 기본 오류 UI 반환
  return renderErrorUI(defaultMessage, defaultDetails)
}

// 라우트 오류 처리 함수
function handleRouteError(
  error: Parameters<typeof isRouteErrorResponse>[0],
  defaultDetails: string
) {
  // 404 오류 처리
  if (error.status === 404) {
    return renderErrorUI('404', 'The requested page could not be found.')
  }

  // 기타 라우트 오류 처리
  return renderErrorUI('Error', error.statusText || defaultDetails)
}

// 오류 UI 렌더링을 위한 함수
function renderErrorUI(message: string, details: string, stack?: string) {
  return (
    <main className="pt-16 p-4 container mx-auto">
      <h1>{message}</h1>
      <p>{details}</p>
      {stack && (
        <pre className="w-full p-4 overflow-x-auto">
          <code>{stack}</code>
        </pre>
      )}
    </main>
  )
}
