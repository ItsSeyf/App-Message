import { lazy, Suspense } from 'react'
import Page404 from './pages/Page404.jsx'
import {Router} from './components/Router.jsx'
import {Route} from './components/Route.jsx'
import './App.css'

const LazyLogin= lazy(()=> import('./pages/Login.jsx'))
const LazyHome= lazy(()=> import('./pages/Home.jsx'))
const LazyRegister= lazy(()=> import('./pages/Register.jsx'))
const user= JSON.parse(sessionStorage.getItem('user') || null)

const appRoutes=[
  {
    path: '/Login',
    Component: LazyLogin
  },
  {
    path: '/Register',
    Component : LazyRegister
  },
  {
    path: '/Home',
    Component: LazyHome
  }
]

function App() {
  return (
    <main>
      <Suspense fallback={null}>
        <Router routes ={appRoutes} defaultComponent={Page404}>
          <Route path='/Login' Component={LazyLogin} />
          <Route path='/Register' Component={LazyRegister} />
          <Route path='/Home' Component={LazyHome} />
          <Route path='/' Component={user ? LazyHome : LazyLogin} />
        </Router>
      </Suspense>
    </main>
  )
}

export default App
