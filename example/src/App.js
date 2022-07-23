import React from 'react'
import { useConnector, useWallet } from 'wallet-adapter'

const App = () => {
  const { connect } = useConnector()
  const { connected, publicKey } = useWallet()

  return (
    <>
      <button onClick={connect}>connect</button>
      {connected && (
        <p
          style={{
            color: 'green'
          }}
        >
          Connected to {publicKey}
        </p>
      )}
    </>
  )
}

export default App
