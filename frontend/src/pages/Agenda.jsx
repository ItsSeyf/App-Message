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
    Divider,
    FormControl,
    FormLabel,
    TextField,
    Typography
} from '@mui/material';
import { useAgenda } from '../hooks/useAgenda.js';
import { navigate } from '../components/Link.jsx';
import Navbar from '../components/Navbar.jsx';

export default function Agenda() {

    const { agenda, error, cargando, mensajeError, handleSubmit, removeFromAgenda,closeAlert} = useAgenda();

    return (
        <>
        <Navbar />
        <Container sx={{ display: 'flex', flexDirection: 'row', gap: 2, height: '92vh', padding: 2 }}>

            <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 2 }}>
                <Typography component="h1" variant="h5">
                    Add user to Agenda
                </Typography>
                <Box component="form" onSubmit={handleSubmit} sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                    <FormControl>
                        <FormLabel htmlFor="receiver">Username</FormLabel>
                        <TextField
                            id="receiver"
                            name="receiver"
                            placeholder="Enter username"
                            fullWidth
                            color='primary'
                            required
                        />
                    </FormControl>
                    <Button
                        type="submit"
                        variant="contained"
                        color="primary"
                        disabled={cargando}
                    >
                        {cargando ? 'Adding to Agenda...' : 'Add to Agenda'}
                    </Button>
                </Box>
                <Divider />
            </Box>

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
                    Agenda
                </Typography>
                {agenda.length > 0 ? (
                    agenda.map((person, index) => (
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
                                onClick={() => navigate(`/Home/${encodeURIComponent(person.username)}/${encodeURIComponent(person.name)}`)}
                                variant="contained"
                                color="secondary"
                                disabled={cargando}
                            >
                                {cargando ? 'Wait...' : 'Open Chat'}
                            </Button>
                            <Button
                                onClick={() => removeFromAgenda(person.username)}
                                variant="contained"
                                color="secondary"
                                disabled={cargando}
                            >
                                {cargando ? 'Blocking...' : 'Block User'}
                            </Button>
                        </Box>
                    ))
                ) : (
                    <Typography variant="body2" color="textSecondary">
                        Empty agenda.
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