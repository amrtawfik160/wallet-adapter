import React from 'react'
import ReactDOM from 'react-dom'
import App from './App'
import {
  WalletProvider,
  MetamaskWalletAdapter,
  PhantomWalletAdapter
} from 'wallet-adapter'

ReactDOM.render(
  <WalletProvider wallets={[MetamaskWalletAdapter, PhantomWalletAdapter]}>
    <App />
  </WalletProvider>,
  document.getElementById('root')
)
