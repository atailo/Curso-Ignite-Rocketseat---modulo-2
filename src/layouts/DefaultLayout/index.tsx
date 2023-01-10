import { Outlet } from 'react-router-dom'
import { Header } from '../../Components/Header'
import { LayoutContainer } from './styles'

export function DefaltLayout() {
  return (
    <LayoutContainer>
      <Header />
      <Outlet />
    </LayoutContainer>
  )
}
