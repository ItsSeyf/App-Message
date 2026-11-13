import { lazy, Suspense } from 'react'
import Page404 from './pages/Page404.jsx'
import {Router} from './components/Router.jsx'
import {Route} from './components/Route.jsx'
import './App.css'

const LazyLogin= lazy(()=> import('./pages/Login.jsx'))
const LazyHome= lazy(()=> import('./pages/Home.jsx'))
const LazyAgenda = lazy(()=> import('./pages/Agenda.jsx'))
const LazyRegister= lazy(()=> import('./pages/Register.jsx'))
const LazyBlocked = lazy(()=> import('./pages/Blocked.jsx'))

const appRoutes=[
  {
    path: '/Login',
    Component: LazyLogin
  },
  {
    path: '/Agenda',
    Component: LazyAgenda
  },
  {
    path: '/Register',
    Component : LazyRegister
  },
  {
    path: '/Home/:receiver/:name',
    Component: LazyHome
  },
  {
    path: '/Blocked',
    Component: LazyBlocked
  }
]

function App() {
  return (
    <main>
      <Suspense fallback={null}>
        <Router routes ={appRoutes} defaultComponent={Page404}>
          <Route path='/Login' Component={LazyLogin} />
          <Route path='/Register' Component={LazyRegister} />
          <Route path='/Home/:receiver/:name' Component={LazyHome} />
          <Route path = '/Agenda' Component = {LazyAgenda} />
          <Route path = '/Blocked' Component = {LazyBlocked} />
          <Route path='/' Component={LazyAgenda} />
        </Router>
      </Suspense>
    </main>
  )
}

export default App
