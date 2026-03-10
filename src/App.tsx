
import { Route, Routes, BrowserRouter as Router } from 'react-router-dom'


import './App.css'
import NotFoundPage from './pages/NotFound'
import Navbar from './components/Navbar'
import MainPage from './pages/MainPage'
import ProjectsPage from './pages/ProjectsPage'

function App() {

  return (
    <>
        <div className="app-container">
            <Router>
                <Navbar />
                <Routes>
                    <Route path='/' element={<MainPage />}/>
                    <Route path='/projects' element={<ProjectsPage />} />

                    <Route path='*' element={<NotFoundPage />} />
                </Routes>
            </Router>
        </div>
    </>
  )
}

export default App
