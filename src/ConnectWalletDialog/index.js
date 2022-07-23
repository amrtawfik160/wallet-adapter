import React from 'react'
import styled from '@emotion/styled'
import PropTypes from 'prop-types'
import WalletCard from './WalletCard'

const Overlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  z-index: 100;
  display: flex;
  justify-content: center;
  align-items: center;
`

const ContentContainer = styled.div`
  padding: 25px;
  max-width: 400px;
  width: 100%;
  border-radius: 7px;
  background: white;
  animation: fadeUp 0.3s ease-in-out;

  @keyframes fadeUp {
    from {
      opacity: 0;
      transform: translateY(15px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }
`

const WalletsContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 11px;

  & > *:not(:last-of-type) {
    margin-bottom: 20px;
  }
`

const Title = styled.h2`
  font-family: 'Inter', sans-serif;
  margin: 0;
  padding-bottom: 20px;
  text-align: center;
`

const ConnectWalletDialog = ({ open, onClose, wallets }) => {
  if (!open) return null

  const handleClickWallet = async (wallet) => {
    await wallet.connect()
  }

  return (
    <Overlay onClick={onClose} className='wallet-adapter__overly'>
      <ContentContainer
        className='wallet-adapter__content-container'
        onClick={(e) => e.stopPropagation()}
      >
        <Title className='wallet-adapter__title'>Connect wallet</Title>
        <WalletsContainer className='wallet-adapter__wallets-container'>
          {Object.values(wallets).map((wallet) => (
            <WalletCard
              name={wallet.name}
              image={wallet.image}
              url={wallet.url}
              onClick={() => handleClickWallet(wallet)}
            />
          ))}
        </WalletsContainer>
      </ContentContainer>
    </Overlay>
  )
}

ConnectWalletDialog.defaultProps = {
  open: false,
  onClose: () => {},
  wallets: {}
}

ConnectWalletDialog.propTypes = {
  open: PropTypes.bool,
  onClose: PropTypes.func,
  wallets: PropTypes.shape({})
}

export default ConnectWalletDialog
