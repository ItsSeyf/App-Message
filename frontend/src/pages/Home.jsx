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
import { useMessages } from '../hooks/useMessages.js';

export default function Home({ routeParams }) {
    const {cargando, error, mensajeError, mensajes, handleSubmit, cerrarSesion, closeAlert} = useMessages();
    return (
        <Container sx={{ display: 'flex', flexDirection: 'row', gap: 2, height: '92vh', padding: 2 }}>

            <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 2 }}>
                <Typography component="h1" variant="h5">
                    Enviar Mensaje
                </Typography>
                <Box component="form" onSubmit={handleSubmit} sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                    <FormControl>
                        <FormLabel htmlFor="receptor">To</FormLabel>
                        <TextField
                            id="receptor"
                            name="receptor"
                            defaultValue={routeParams.receiver}
                            fullWidth
                            color="primary"
                            disabled = "true"
                            required
                        />
                    </FormControl>
                    <FormControl>
                        <FormLabel htmlFor="mensaje">Message</FormLabel>
                        <TextField
                            id="mensaje"
                            name="mensaje"
                            placeholder="Write your message"
                            fullWidth
                            multiline
                            required
                            color="primary"
                            rows={4}
                        />
                    </FormControl>
                    <Button
                        type="submit"
                        variant="contained"
                        color="primary"
                        disabled={cargando}
                    >
                        {cargando ? 'Sending...' : 'Send'}
                    </Button>
                </Box>
                <Divider />
                <Button
                    color="primary"
                    onClick={cerrarSesion}
                    disabled={cargando}>
                    {cargando ? 'Wait...' : 'Log Off'}
                </Button>
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
                    Messages
                </Typography>
                {mensajes.length > 0 ? (
                    mensajes.map((mensaje, index) => (
                        <Box
                            key={index}
                            sx={{
                                marginBottom: 2,
                                padding: 2,
                                border: '1px solid #ddd',
                                borderRadius: 2,
                                backgroundColor: mensaje.sender === usuario ? '#E3F2FD' : '#FFCDD2',
                                color: '#333333'
                            }}
                        >
                            <Typography variant="body1">
                                <strong>From:</strong> {mensaje.sender === usuario ? 'Tú' : mensaje.sender} <br />
                            </Typography>
                            <Typography variant="body1">
                                <strong>To:</strong> {mensaje.receiver === usuario ? 'Tú' : mensaje.receiver} <br />
                                <strong>Message:</strong>
                            </Typography>
                            <Typography variant="body2" sx={{ marginTop: 1 }}>
                                {mensaje.messages}
                            </Typography>
                            <Typography variant="caption" sx={{ display: 'block', marginTop: 1, color: '#333333' }}>
                                {mensaje.created_at ? new Date(mensaje.created_at).toLocaleString() : 'Fecha no disponible'}
                            </Typography>
                        </Box>
                    ))
                ) : (
                    <Typography variant="body2" color="textSecondary">
                        You don't have any messages yet.
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
    );
}