import { useState, useEffect } from 'react';
import * as Material from '@mui/material';
import { io } from "https://cdn.socket.io/4.8.1/socket.io.esm.min.js";

export default function Home() {
    const [cargando, setCargando] = useState(false);
    const [error, setError] = useState(false);
    const [mensajeError, setMensajeError] = useState('');
    const [errorMesanje, setErrorMensaje] = useState(false);
    const [errorMesanjetext, seterrorMesanjetext] = useState('');
    const [errorReceptor, seterrorReceptor] = useState(false);
    const [mensajeErrorReceptor, setmensajeErrorReceptor] = useState('');
    const [mensajes, setMensajes] = useState([]);
    const usuario = JSON.parse(sessionStorage.getItem('user'));
    if (!usuario) {
        window.location.href = '/Login'
        return null;
    }
    useEffect(() => {
        (async()=>{
            setCargando(true);
            if (usuario !== 'admin') {
                const respuesta = await fetch(`http://localhost:1234/messages?username=${usuario}`)
                if(respuesta.ok){
                    const data = await respuesta.json()
                    setMensajes(data)
                    setCargando(false);
                    return
                }
                setError(true);
                setMensajeError('Error en la respuesta del servidor a la hora de obtener los mensajes')
                setCargando(false);
                console.error(mensajeError)
            } else {
                const respuesta = await fetch('http://localhost:1234/messages')
                if(respuesta.ok){
                    const data = await respuesta.json()
                    setMensajes(data)
                    setCargando(false);
                    return
                }
                setError(true);
                setMensajeError('Error en la respuesta del servidor a la hora de obtener los mensajes')
                setCargando(false);
                console.error(mensajeError)
            }
        }) ()
        console.log('Conectando al servidor de Socket.IO...')
        const socket = io("http://localhost:1234")

        socket.on('connect', () => {
            console.log('Conectado al servidor de Socket.IO');
        });
        
        socket.on('connect_error', (err) => {
            console.error('Error de conexión:', err);
        });
        socket.on('message', (mensaje) => {
            if(mensaje.receiver !== usuario && usuario !== 'admin' && mensaje.sender !== usuario){
                console.log('Mensaje ignorado, no es para este usuario.');
                return
            }
            console.log('Nuevo mensaje', mensaje)
            setMensajes((prevMensajes) => [...prevMensajes, mensaje]);
        });

        return() => {
        socket.off('message')
        socket.off('connect');
        socket.off('connect_error');
        socket.disconnect();
    }
    }, [usuario])
    const validar = () => {
        let valido = true;
        const mensaje = document.getElementById('mensaje');
        const receptor = document.getElementById('receptor');
        if (mensaje.value.length < 1) {
            setErrorMensaje(true);
            seterrorMesanjetext('El mensaje no puede estar vacio')
            valido = false;
        }
        else if(receptor.value.length < 1){
            seterrorReceptor(true);
            setmensajeErrorReceptor('El receptor no puede estar vacio')
            valido=false;
        }
        return valido;
    }
    const handleSubmit= async(event)=>{
        setCargando(true);
        if(errorMesanje || errorReceptor){
            event.preventDefault();
            setCargando(false);
            return;
        }
        event.preventDefault();
        const form =event.currentTarget;
        const data= new FormData(form);
        const mensaje = data.get('mensaje')
        const receptor = data.get('receptor')
        const fecha = new Date().toISOString()
        try{
            const respuesta = await fetch('http://localhost:1234/messages', {
                method : 'POST',
                headers : {
                    'Content-Type': 'application/json'
                },
                body : JSON.stringify({
                    sender: usuario,
                    receiver: receptor,
                    messages: mensaje,
                    fecha: fecha
                })
            })
            if(respuesta.ok){
                setCargando(false);
                setMensajes((prevMensajes)=>[...prevMensajes, {
                    sender: usuario,
                    receiver: receptor,
                    messages: mensaje,
                    created_at: fecha
                }])
                form.reset()
                return
            }
            throw new Error('Error en la respuesta del servidor')

        }catch(error){
            setCargando(false);
            console.error('Error en la solicitud:', error)
        }
    }
    const cerrarSesion=()=>{
        sessionStorage.clear()
        window.location.href='/Login'
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
                            color= { errorReceptor ?'error': 'primary'}
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
                            color= { errorMesanje ?'error': 'primary'}
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
                <Material.Divider/>
                <Material.Button
                color ="primary"
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
                    Historial de Mensajes
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
                                color : '#333333'
                            }}
                        >
                            <Material.Typography variant="body1">
                                <strong>De:</strong> {mensaje.sender === usuario ? 'Tú' : mensaje.sender} <br/>
                            </Material.Typography>
                            <Material.Typography variant="body1">
                                <strong>Para:</strong> {mensaje.receiver === usuario ? 'Tú' : mensaje.receiver} <br/>
                                <strong>Mensaje:</strong>
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
                        No hay mensajes aún.
                    </Material.Typography>
                )}
            </Material.Box>
        </Material.Container>
    );
}