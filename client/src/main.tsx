import { StrictMode } from "react"
import { createRoot } from "react-dom/client"
import "./index.css"
import App from "./App.tsx"
import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import { getAuth } from 'firebase/auth'
import {Provider} from 'react-redux'
import { store } from './store/index.ts'
import app from "./config/firebase.ts"

export const auth = getAuth(app)

// Create a QueryClient instance
const queryClient = new QueryClient()

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <Provider store={store}>
      <QueryClientProvider client={queryClient}>
        <App />
      </QueryClientProvider>
    </Provider>
  </StrictMode>
)
