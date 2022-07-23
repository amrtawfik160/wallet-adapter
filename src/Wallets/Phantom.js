import {
  clusterApiUrl,
  Connection,
  LAMPORTS_PER_SOL,
  PublicKey,
  SystemProgram,
  Transaction
} from '@solana/web3.js'

export class PhantomWalletAdapter {
  name = 'Phantom'
  url = 'https://phantom.app'
  image =
    'data:image/svg+xml;base64,PHN2ZyBmaWxsPSJub25lIiBoZWlnaHQ9IjM0IiB3aWR0aD0iMzQiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGxpbmVhckdyYWRpZW50IGlkPSJhIiB4MT0iLjUiIHgyPSIuNSIgeTE9IjAiIHkyPSIxIj48c3RvcCBvZmZzZXQ9IjAiIHN0b3AtY29sb3I9IiM1MzRiYjEiLz48c3RvcCBvZmZzZXQ9IjEiIHN0b3AtY29sb3I9IiM1NTFiZjkiLz48L2xpbmVhckdyYWRpZW50PjxsaW5lYXJHcmFkaWVudCBpZD0iYiIgeDE9Ii41IiB4Mj0iLjUiIHkxPSIwIiB5Mj0iMSI+PHN0b3Agb2Zmc2V0PSIwIiBzdG9wLWNvbG9yPSIjZmZmIi8+PHN0b3Agb2Zmc2V0PSIxIiBzdG9wLWNvbG9yPSIjZmZmIiBzdG9wLW9wYWNpdHk9Ii44MiIvPjwvbGluZWFyR3JhZGllbnQ+PGNpcmNsZSBjeD0iMTciIGN5PSIxNyIgZmlsbD0idXJsKCNhKSIgcj0iMTciLz48cGF0aCBkPSJtMjkuMTcwMiAxNy4yMDcxaC0yLjk5NjljMC02LjEwNzQtNC45NjgzLTExLjA1ODE3LTExLjA5NzUtMTEuMDU4MTctNi4wNTMyNSAwLTEwLjk3NDYzIDQuODI5NTctMTEuMDk1MDggMTAuODMyMzctLjEyNDYxIDYuMjA1IDUuNzE3NTIgMTEuNTkzMiAxMS45NDUzOCAxMS41OTMyaC43ODM0YzUuNDkwNiAwIDEyLjg0OTctNC4yODI5IDEzLjk5OTUtOS41MDEzLjIxMjMtLjk2MTktLjU1MDItMS44NjYxLTEuNTM4OC0xLjg2NjF6bS0xOC41NDc5LjI3MjFjMCAuODE2Ny0uNjcwMzggMS40ODQ3LTEuNDkwMDEgMS40ODQ3LS44MTk2NCAwLTEuNDg5OTgtLjY2ODMtMS40ODk5OC0xLjQ4NDd2LTIuNDAxOWMwLS44MTY3LjY3MDM0LTEuNDg0NyAxLjQ4OTk4LTEuNDg0Ny44MTk2MyAwIDEuNDkwMDEuNjY4IDEuNDkwMDEgMS40ODQ3em01LjE3MzggMGMwIC44MTY3LS42NzAzIDEuNDg0Ny0xLjQ4OTkgMS40ODQ3LS44MTk3IDAtMS40OS0uNjY4My0xLjQ5LTEuNDg0N3YtMi40MDE5YzAtLjgxNjcuNjcwNi0xLjQ4NDcgMS40OS0xLjQ4NDcuODE5NiAwIDEuNDg5OS42NjggMS40ODk5IDEuNDg0N3oiIGZpbGw9InVybCgjYikiLz48L3N2Zz4K'

  constructor({ onConnect, cluster = 'mainnet-beta' }) {
    this.onConnect = onConnect
    this.cluster = this.#validateCluster(cluster)
  }

  #validateCluster(cluster) {
    const clusters = ['mainnet-beta', 'devnet', 'testnet']
    if (clusters.includes(cluster)) {
      return cluster
    } else {
      throw new Error(
        `Invalid cluster "${cluster}", must be one of: ${clusters.join(', ')}`
      )
    }
  }

  isInstalled = () => {
    if ('solana' in window) {
      const provider = window.solana
      if (provider.isPhantom) {
        return true
      }
    } else {
      return false
    }
  }

  getProvider = () => {
    if (this.isInstalled()) {
      return window.solana
    } else {
      window.open(this.url, '_blank')
    }
  }

  connect = async () => {
    const resp = await window.solana.connect()
    const publicKey = resp?.publicKey.toString()
    this.onConnect()
    return publicKey
  }

  isConnected = () => {
    return this.getProvider().isConnected
  }

  getPublicKey = () => {
    return this.getProvider().publicKey
  }

  getBalance = async () => {
    const connection = new Connection(clusterApiUrl(this.cluster))
    const accountInfo = await connection.getAccountInfo(this.getPublicKey())
    return accountInfo.lamports / LAMPORTS_PER_SOL
  }

  sendTransaction = async ({ to, value, options = {} }) => {
    const connection = new Connection(clusterApiUrl(this.cluster))

    const receiverWallet = new PublicKey(to)
    // Create an unsigned transaction
    let transaction = new Transaction().add(
      SystemProgram.transfer({
        fromPubkey: this.getPublicKey(),
        toPubkey: receiverWallet,
        lamports: value * LAMPORTS_PER_SOL // Convert sol to lamports
      })
    )
    transaction.feePayer = await this.getProvider().publicKey
    // Includes a recent blockhash to prevent duplication and to give transactions lifetimes
    const blockhashObj = await connection.getRecentBlockhash()
    transaction.recentBlockhash = await blockhashObj.blockhash

    // Sign and send transaction
    const { signature } = await window.solana.signAndSendTransaction(
      transaction,
      options
    )
    // Ask the user's Phantom wallet to sign and send the transaction
    await connection.confirmTransaction(signature)

    return signature
  }

  onPublicKeyChanged = (callback) => {
    this.getProvider().on('connect', () => {
      const publicKey = this.getProvider().publicKey
      callback(publicKey)
    })
  }
}
