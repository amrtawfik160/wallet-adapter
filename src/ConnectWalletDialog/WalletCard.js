import React from 'react'
import styled from '@emotion/styled'
import PropTypes from 'prop-types'

const Container = styled.div`
  width: 100%;
  height: 27px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  cursor: pointer;
  transition: all 0.2s ease-in-out;
  padding: 25px 16px;
  background: #e6e6e6;
  box-sizing: border-box;
  border-radius: 7px;

  &:hover {
    background: #ececec;
  }
`

const Title = styled.h3`
  font-family: 'Inter', sans-serif;
  font-size: 1rem;
  margin: 0;
`

const WalletCard = ({ name, image, onClick }) => (
  <Container onClick={onClick} className='wallet-adapter__wallet-container'>
    <Title className='wallet-adapter__wallet-name'>{name}</Title>
    <img
      src={image}
      alt=''
      style={{ width: 22 }}
      className='wallet-adapter__wallet-icon'
    />
  </Container>
)

WalletCard.defaultProps = {
  onClick: () => {}
}

WalletCard.propTypes = {
  name: PropTypes.string.isRequired,
  image: PropTypes.string.isRequired,
  onClick: PropTypes.func
}

export default WalletCard
