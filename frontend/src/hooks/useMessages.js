import { socket } from '../services/messages.js'
import { getMessages, sendMessage, Logout } from '../services/messages.js'
import { useState, useEffect, useReducer } from 'react';
import { messagesReducer, messagesInitialState } from '../reducers/messages.js';

export function useMessages() {
    const [state, dispatch] = useReducer(messagesReducer, messagesInitialState);
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
            if(!respuesta){
                setCargando(false);
                return;
            }
            dispatch({
                type: 'LOAD',
                payload: respuesta
            })
            return;
        })()
        console.log('Coneccting Socket...')

        socket.on('connect', () => {
            console.log('Socket connected');
        });

        socket.on('connect_error', (err) => {
            console.error('Socket error:', err);
        });
        socket.on('message', (mensaje) => {
            console.log('New message', mensaje)
            dispatch({
                type: 'ADD',
                payload: mensaje
            })
        });

        return () => {
            socket.off('message')
            socket.off('connect');
            socket.off('connect_error');
            socket.disconnect();
        }
    }, [])
    useEffect(()=>{
        setCargando(false)
    }, [state])
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
        } else if (respuesta === 404) {
            setCargando(false);
            setError(true);
            setMensajeError('Message not sent. Please try again.');
            return;
        } else if (respuesta.status === 401) {
            setCargando(false);
            form.reset();
            window.location.href = '/Login'
            return
        }
        setCargando(false);
        dispatch({
            type: 'ADD',
            payload: {id: respuesta, receptor}
        })
        form.reset()
        return
    }
    const cerrarSesion = async () => {
        await Logout();
        window.location.href = '/Login'
    }
    const closeAlert = () => {
        setError(false);
        setMensajeError('');
    }

    return { cargando, error, mensajeError, mensajes, handleSubmit, cerrarSesion, closeAlert }
}