import { ToastContainer } from 'react-toastify'
import './App.css'
import Login from './Components/Login'
import Home from './Home'
import { Route, Routes } from 'react-router-dom'

function App() {


  return (
    <>
     <Routes>
        <Route path='/' element={<Login/>}/>
        <Route path='/home' element={<Home/>}/>
     </Routes>
      <ToastContainer/>
    </>
  )
}

export default App
