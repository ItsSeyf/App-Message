import {
    Alert,
    AlertTitle,
    Box,
    Button,
    Container,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    Typography
} from '@mui/material';
import { useBlock } from '../hooks/useBlock.js'
import Navbar from '../components/Navbar.jsx'
export default function Blocked() {
    const { blockedUsers, cargando, error, mensajeError, handleUnblockUser, closeAlert } = useBlock();

    return (
        <>
        <Navbar />
        <Container sx={{ display: 'flex', flexDirection: 'row', gap: 2, height: '92vh', padding: 2 }}>

            <Box
                sx={{
                    flex: 2,
                    overflowY: 'auto',
                    border: '1px solid #ccc',
                    borderRadius: 2,
                    padding: 2,
                    maxHeight: '80vh'
                }}
            >
                <Typography component="h1" variant="h5">
                    Blocked Users
                </Typography>
                {blockedUsers.length > 0 ? (
                    blockedUsers.map((person, index) => (
                        <Box
                            key={index}
                            sx={{
                                marginBottom: 2,
                                padding: 2,
                                border: '1px solid #ddd',
                                borderRadius: 2,
                                backgroundColor: '#FFCDD2',
                                color: '#333333'
                            }}
                        >
                            <Typography variant="body2" sx={{ marginTop: 1 }}>
                                {person.name}
                            </Typography>
                            <Typography variant="body2" sx={{ marginTop: 1 }}>
                                {person.username}
                            </Typography>
                            <Button
                                onClick={() => handleUnblockUser(person.username)}
                                variant="contained"
                                color="secondary"
                                disabled={cargando}
                            >
                                {cargando ? 'Unblocking...' : 'Unblock User'}
                            </Button>
                        </Box>
                    ))
                ) : (
                    <Typography variant="body2" color="textSecondary">
                        No blocked users.
                    </Typography>
                )}
            </Box>
            <Dialog
                open={error}
                onClose={closeAlert}
                aria-labelledby="error-dialog-title"
                aria-describedby="error-dialog-description"
            >
                <DialogTitle id="error-dialog-title">An error occurred</DialogTitle>
                <DialogContent>
                    <Alert severity="error" sx={{ mt: 1 }}>
                        <AlertTitle>Error</AlertTitle>
                        <span id="error-dialog-description">{mensajeError}</span>
                    </Alert>
                </DialogContent>
                <DialogActions>
                    <Button onClick={closeAlert} variant="contained" color="error" autoFocus>
                        Close
                    </Button>
                </DialogActions>
            </Dialog>
        </Container>
        </>
    )
}