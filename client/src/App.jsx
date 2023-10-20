import { Route, Routes } from 'react-router-dom'
import './App.css'

function App() {

  return (
    <>
      <Routes>
        <Route path='/' element={<Card/>} ></Route>
      </Routes>
    </>
  )
}

export default App
