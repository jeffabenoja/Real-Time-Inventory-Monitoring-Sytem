import React, { ReactNode } from "react"
import { Provider } from "react-redux"
import { store, persistor } from "../../store/index"
import { PersistGate } from "redux-persist/integration/react"

interface StoreProvider {
  children: ReactNode
}

const StoreProvider: React.FC<StoreProvider> = ({ children }) => {
  return (
    <PersistGate persistor={persistor}>
      <Provider store={store}>{children}</Provider>
    </PersistGate>
  )
}

export default StoreProvider
