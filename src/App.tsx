
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import MainLayout from './layouts/MainLayout'
import CharacterPage from './pages/CharacterPage'
import DefaultCharacterView from './pages/DefaultCharacterView'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<MainLayout />}>
          <Route index element={<DefaultCharacterView />} />
          <Route path="character/:id" element={<CharacterPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}

export default App
