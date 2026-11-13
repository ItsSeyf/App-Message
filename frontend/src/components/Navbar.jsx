import { AppBar, Button, Toolbar } from '@mui/material'
import { Logout } from '../services/messages.js'
import { navigate } from './Link.jsx'

export default function Navbar() {
    const currentPath = window.location.pathname

    const handleLogout = async () => {
        await Logout()
        window.location.href = '/Login'
    }

    const handleNavigation = (event, path) => {
        const isModifiedClick = event.metaKey || event.altKey || event.ctrlKey || event.shiftKey
        if (event.button !== 0 || isModifiedClick) return

        event.preventDefault()
        navigate(path)
        window.scrollTo(0, 0)
    }

    return (
        <AppBar component="nav" position="static" elevation={1}>
            <Toolbar sx={{ justifyContent: 'flex-end', gap: 1, flexWrap: 'wrap' }}>
                <Button
                    component="a"
                    href="/Agenda"
                    color="inherit"
                    aria-current={currentPath === '/Agenda' || currentPath === '/' ? 'page' : undefined}
                    onClick={(event) => handleNavigation(event, '/Agenda')}
                >
                    Agenda
                </Button>
                <Button
                    component="a"
                    href="/Blocked"
                    color="inherit"
                    aria-current={currentPath === '/Blocked' ? 'page' : undefined}
                    onClick={(event) => handleNavigation(event, '/Blocked')}
                >
                    Blocked Users
                </Button>
                <Button color="inherit" onClick={handleLogout}>
                    Log Out
                </Button>
            </Toolbar>
        </AppBar>
    )
}