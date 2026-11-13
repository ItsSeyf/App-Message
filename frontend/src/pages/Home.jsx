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
import { useState } from 'react';
import { useMessages } from '../hooks/useMessages.js';
import Navbar from '../components/Navbar.jsx';

export default function Home({ routeParams }) {
    const {cargando, error, mensajeError, state, handleSubmit, closeAlert, editmessage, deletemessage} = useMessages(routeParams);
    const [editingMessageId, setEditingMessageId] = useState(null);
    const [editedMessage, setEditedMessage] = useState('');

    return (
        <>
        <Navbar />
        <Container sx={{ display: 'flex', flexDirection: 'row', gap: 2, height: '92vh', padding: 2 }}>

            <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 2 }}>
                <Typography component="h1" variant="h5">
                    Send a Message
                </Typography>
                <Box component="form" onSubmit={handleSubmit} sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                    <FormControl>
                        <FormLabel htmlFor="name">To</FormLabel>
                        <TextField
                            id="name"
                            name="name"
                            defaultValue={routeParams.name}
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
                    <FormControl>
                        <TextField
                            id="receptor"
                            name="receptor"
                            type='hidden'
                            value={routeParams.receiver}
                            fullWidth
                            color="primary"
                            required
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
                {state.length > 0 ? (
                    state.map((mensaje, index) => {
                        const isEditing = editingMessageId === mensaje.id;
                        const messageText = mensaje.message ?? mensaje.messages;

                        return (
                            <Box
                                key={index}
                                sx={{
                                    marginBottom: 2,
                                    padding: 2,
                                    border: '1px solid #ddd',
                                    borderRadius: 2,
                                    backgroundColor: mensaje.receiver === routeParams.receiver ? '#E3F2FD' : '#FFCDD2',
                                    color: '#333333'
                                }}
                            >
                                <Typography variant="body1">
                                    <strong>From:</strong> {mensaje.sender === routeParams.receiver ? mensaje.receiver : 'You'} <br />
                                </Typography>
                                <Typography variant="body1">
                                    <strong>To:</strong> {mensaje.receiver === routeParams.receiver ? mensaje.receiver : 'You'} <br />
                                    <strong>Message:</strong>
                                </Typography>
                                {isEditing ? (
                                    <TextField
                                        value={editedMessage}
                                        onChange={(event) => setEditedMessage(event.target.value)}
                                        multiline
                                        fullWidth
                                        autoFocus
                                        disabled={cargando}
                                        sx={{ mt: 1 }}
                                        inputProps={{ 'aria-label': 'Edit message' }}
                                    />
                                ) : (
                                    <Typography variant="body2" sx={{ marginTop: 1, whiteSpace: 'pre-wrap' }}>
                                        {messageText}
                                    </Typography>
                                )}
                                <Typography variant="caption" sx={{ display: 'block', marginTop: 1, color: '#333333' }}>
                                    {mensaje.created_at ? new Date(mensaje.created_at).toLocaleString() : 'Fecha no disponible'}
                                </Typography>
                                <Box sx={{ display: 'flex', gap: 1, justifyContent: 'flex-end', mt: 1 }}>
                                    {isEditing ? (
                                        <>
                                            <Button
                                                onClick={() => {
                                                    setEditingMessageId(null);
                                                    setEditedMessage('');
                                                }}
                                                disabled={cargando}
                                            >
                                                Cancel
                                            </Button>
                                            <Button
                                                onClick={async () => {
                                                    await editmessage({ id: mensaje.id, messages: editedMessage });
                                                    setEditingMessageId(null);
                                                    setEditedMessage('');
                                                }}
                                                variant="contained"
                                                disabled={cargando || !editedMessage.trim()}
                                            >
                                                Accept
                                            </Button>
                                        </>
                                    ) : (
                                        <>
                                            <Button
                                                onClick={() => {
                                                    setEditingMessageId(mensaje.id);
                                                    setEditedMessage(messageText);
                                                }}
                                                disabled={cargando}
                                            >
                                                Edit
                                            </Button>
                                            <Button
                                                onClick={() => deletemessage(mensaje.id)}
                                                disabled={cargando}
                                                color="error"
                                            >
                                                Delete
                                            </Button>
                                        </>
                                    )}
                                </Box>
                            </Box>
                        );
                    })
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
        </>
    );
}