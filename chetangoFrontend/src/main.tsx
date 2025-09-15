import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { Provider } from 'react-redux'
import { store } from '@/app/store'
import { QueryProvider } from '@/app/providers/QueryProvider'
import App from '@/App'
import '@/design-system/tokens/global.scss'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Provider store={store}>
      <QueryProvider>
        <App />
      </QueryProvider>
    </Provider>
  </StrictMode>,
)
