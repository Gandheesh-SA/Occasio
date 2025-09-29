import { useState } from 'react'
import { Route, Routes } from 'react-router-dom'
import VenueForm from './pages/venueform'
import ResultScreen from './pages/result'


function App() {

  return (
    <>
    <Routes>
      <Route path='/' element={<VenueForm />} />
      <Route path='/venuelist' element={<ResultScreen />} />
    </Routes>
    
    </>
  )
}

export default App
