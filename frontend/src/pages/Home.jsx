import { useState, useEffect } from 'react';
import * as Material from '@mui/material';
import { socket } from '../services/messages.js'
import { getMessages, sendMessage,Logout } from '../services/messages.js'

export default function Home() {
    const [cargando, setCargando] = useState(false);
    const [error, setError] = useState(false);
    const [mensajeError, setMensajeError] = useState('');
    const [mensajes, setMensajes] = useState([]);
    useEffect(() => {
        (async () => {
            setCargando(true);
            const respuesta = await getMessages();
            if (respuesta.status === 500) {
                setError(true);
                setMensajeError('Server error while getting messages. Try again later.');
                setCargando(false);
            } else if (respuesta.status === 401) {
                setCargando(false);
                window.location.href = '/Login'
                return;
            }
            const data = await respuesta.json()
            setMensajes(data)
            setCargando(false);
            return;
        })()
        console.log('Conectando al servidor de Socket.IO...')

        socket.on('connect', () => {
            console.log('Conectado al servidor de Socket.IO');
        });

        socket.on('connect_error', (err) => {
            console.error('Error de conexión:', err);
        });
        socket.on('message', (mensaje) => {
            if (mensaje.receiver !== usuario && mensaje.sender !== usuario) {
                console.log('Mensaje ignorado, no es para este usuario.');
                return
            }
            console.log('Nuevo mensaje', mensaje)
            setMensajes((prevMensajes) => [...prevMensajes, mensaje]);
        });

        return () => {
            socket.off('message')
            socket.off('connect');
            socket.off('connect_error');
            socket.disconnect();
        }
    }, [])
    const handleSubmit = async (event) => {
        setCargando(true);
        event.preventDefault();
        const form = event.currentTarget;
        const data = new FormData(form);
        const mensaje = data.get('mensaje')
        const receptor = data.get('receptor')
        const fecha = new Date().toISOString()
        const respuesta = await sendMessage({ receiver: receptor, messages: mensaje, fecha: fecha });
        if (respuesta === 500) {
            setCargando(false);
            setError(true);
            setMensajeError('Server error while sending message. Try again later.');
            return;
        } else if (respuesta.status === 404) {
            setCargando(false);
            setError(true);
            setMensajeError('Message not sent. Please try again.');
            return;
        }
        setCargando(false);
        setMensajes((prevMensajes) => [...prevMensajes, {
            sender: usuario,
            receiver: receptor,
            messages: mensaje,
            created_at: fecha
        }])
        form.reset()
        return
    }
    const cerrarSesion = async() => {
        await Logout();
        window.location.href = '/Login'
    }
    return (
        <Material.Container sx={{ display: 'flex', flexDirection: 'row', gap: 2, height: '92vh', padding: 2 }}>

            <Material.Box sx={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 2 }}>
                <Material.Typography component="h1" variant="h5">
                    Enviar Mensaje
                </Material.Typography>
                <Material.Box component="form" onSubmit={handleSubmit} sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                    <Material.FormControl>
                        <Material.FormLabel htmlFor="receptor">Receptor</Material.FormLabel>
                        <Material.TextField
                            id="receptor"
                            name="receptor"
                            placeholder="Usuario receptor"
                            error={errorReceptor}
                            helperText={mensajeErrorReceptor}
                            fullWidth
                            color={errorReceptor ? 'error' : 'primary'}
                            required
                        />
                    </Material.FormControl>
                    <Material.FormControl>
                        <Material.FormLabel htmlFor="mensaje">Mensaje</Material.FormLabel>
                        <Material.TextField
                            id="mensaje"
                            name="mensaje"
                            placeholder="Escribe tu mensaje"
                            error={errorMesanje}
                            helperText={errorMesanjetext}
                            fullWidth
                            multiline
                            required
                            color={errorMesanje ? 'error' : 'primary'}
                            rows={4}
                        />
                    </Material.FormControl>
                    <Material.Button
                        type="submit"
                        variant="contained"
                        color="primary"
                        onClick={validar}
                        disabled={cargando}
                    >
                        {cargando ? 'Enviando...' : 'Enviar'}
                    </Material.Button>
                </Material.Box>
                <Material.Divider />
                <Material.Button
                    color="primary"
                    onClick={cerrarSesion}
                    disabled={cargando}>
                    {cargando ? 'Espera a que se envie el mensaje...' : 'Cerrar Sesion'}
                </Material.Button>
            </Material.Box>

            <Material.Box
                sx={{
                    flex: 2,
                    overflowY: 'auto',
                    border: '1px solid #ccc',
                    borderRadius: 2,
                    padding: 2,
                    maxHeight: '80vh'
                }}
            >
                <Material.Typography component="h1" variant="h5">
                    Messages
                </Material.Typography>
                {mensajes.length > 0 ? (
                    mensajes.map((mensaje, index) => (
                        <Material.Box
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
                            <Material.Typography variant="body1">
                                <strong>From:</strong> {mensaje.sender === usuario ? 'Tú' : mensaje.sender} <br />
                            </Material.Typography>
                            <Material.Typography variant="body1">
                                <strong>To:</strong> {mensaje.receiver === usuario ? 'Tú' : mensaje.receiver} <br />
                                <strong>Message:</strong>
                            </Material.Typography>
                            <Material.Typography variant="body2" sx={{ marginTop: 1 }}>
                                {mensaje.messages}
                            </Material.Typography>
                            <Material.Typography variant="caption" sx={{ display: 'block', marginTop: 1, color: '#333333' }}>
                                {mensaje.created_at ? new Date(mensaje.created_at).toLocaleString() : 'Fecha no disponible'}
                            </Material.Typography>
                        </Material.Box>
                    ))
                ) : (
                    <Material.Typography variant="body2" color="textSecondary">
                        You don't have any messages yet.
                    </Material.Typography>
                )}
            </Material.Box>
        </Material.Container>
    );
}