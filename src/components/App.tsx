import React from 'react'
import styled from '@emotion/styled/macro'

const StyledApp = styled('div')({
	background: '#eeeeee',
	width: '100vw',
	height: '100vh',
	display: 'flex',
	alignItems: 'center',
	justifyContent: 'center',
})

const App = () => {
	return <StyledApp>Hello World!</StyledApp>
}

export default App
