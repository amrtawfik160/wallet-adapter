import { useContext } from 'react'
import { WalletContext } from '../WalletContext'

const useConnector = () => {
  const { connect, wallets } = useContext(WalletContext)

  return {
    connect,
    wallets
  }
}

export default useConnector
