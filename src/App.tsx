
import './App.css'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import CharacterPage from './pages/CharacterPage'
import Home from './pages/Home'

function App() {

  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/character/:id" element={<CharacterPage />} />
        </Routes>
      </BrowserRouter>
    </>
  )
}

export default App
