import React, { createContext, useState } from 'react'
import ConnectWalletDialog from '../ConnectWalletDialog'
import { Global, css } from '@emotion/react'

const WalletContext = createContext()

const WalletProvider = ({ wallets, options = {}, children }) => {
  const [connectedWallet, setConnectedWallet] = useState(null)
  const [openConnectDialog, setOpenConnectDialog] = useState(false)

  wallets = wallets.reduce((acc, WalletAdapter) => {
    const onConnect = () => {
      setConnectedWallet(wallet)
      closeConnectDialog()
    }
    const wallet = new WalletAdapter({ onConnect, ...options })

    acc[wallet.name] = wallet
    return acc
  }, {})

  const closeConnectDialog = () => {
    setOpenConnectDialog(false)
  }

  const connect = async () => {
    setOpenConnectDialog(true)
  }

  return (
    <WalletContext.Provider value={{ connectedWallet, connect, wallets }}>
      <ConnectWalletDialog
        open={openConnectDialog}
        onClose={closeConnectDialog}
        wallets={wallets}
      />

      <Global
        styles={css`
          @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;500&display=swap');
        `}
      />

      {children}
    </WalletContext.Provider>
  )
}

export { WalletContext, WalletProvider }
