import { Route, Routes } from 'react-router-dom'
import { DefaltLayout } from './layouts/DefaultLayout'
import { History } from './pages/History'
import { Home } from './pages/home'

export function Router() {
  return (
    <Routes>
      <Route path="/" element={<DefaltLayout />}>
        <Route path="/" element={<Home />} />
        <Route path="/history" element={<History />} />
      </Route>
    </Routes>
  )
}
