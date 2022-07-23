import { useContext, useEffect, useState } from 'react'
import { WalletContext } from '../WalletContext'

const useWallet = () => {
  const { connectedWallet } = useContext(WalletContext)
  const [info, setInfo] = useState({
    publicKey: '',
    connected: false,
    chainId: '',
    networkName: ''
  })

  useEffect(() => {
    ;(async () => {
      if (connectedWallet) {
        const publicKey = await connectedWallet.getPublicKey()
        if (publicKey) {
          setInfo((prevState) => ({
            ...prevState,
            connected: true,
            publicKey: publicKey.toString()
          }))
        }
        connectedWallet.onPublicKeyChanged(handlePublicKeyChanges)

        if (connectedWallet.name === 'Metamask') {
          const chainId = await connectedWallet.getChainId()
          const networkName = getNetworkName(chainId)
          setInfo((prevState) => ({
            ...prevState,
            chainId,
            networkName
          }))
          connectedWallet.onChainIdChanged(handleChainIdChanged)
        }
      }
    })()
  }, [connectedWallet])

  const getNetworkName = (id) => {
    const networkChain = {
      1: 'mainnet',
      3: 'ropsten',
      4: 'rinkeby',
      42: 'kovan',
      137: 'Polygon'
    }

    return networkChain[id]
  }

  const handlePublicKeyChanges = (publicKey) => {
    if (publicKey) {
      setInfo((prevState) => ({
        ...prevState,
        connected: publicKey.length > 0,
        publicKey: publicKey.toString()
      }))
    } else {
      setInfo((prevState) => ({
        ...prevState,
        connected: false,
        publicKey: ''
      }))
    }
  }

  const handleChainIdChanged = (chainId) => {
    setInfo((prevState) => ({
      ...prevState,
      chainId,
      networkName: getNetworkName(chainId)
    }))
  }

  return {
    sendTransaction: connectedWallet?.sendTransaction.bind(connectedWallet),
    getBalance: connectedWallet?.getBalance.bind(connectedWallet),
    provider: connectedWallet?.getProvider(),
    blockchain: connectedWallet?.blockchain,
    wallet: connectedWallet,
    ...info
  }
}

export default useWallet
