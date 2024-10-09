import React from 'react'
import FornInPutData from './components/FornInPutData'
import Header from './components/Header'

const App = () => {
  return (
    <div>
      <div className="header"><Header /></div>
      <div className="content"><FornInPutData /></div>
    </div>
  )
}

export default App