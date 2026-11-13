import { socket } from '../services/messages.js'
import { getMessages, sendMessage, Logout, editMessage, deleteMessage } from '../services/messages.js'
import { useState, useEffect, useReducer } from 'react';
import { messagesReducer, messagesInitialState } from '../reducers/messages.js';

export function useMessages(receiver) {
    const [state, dispatch] = useReducer(messagesReducer, messagesInitialState);
    const [cargando, setCargando] = useState(false);
    const [error, setError] = useState(false);
    const [mensajeError, setMensajeError] = useState('');
    useEffect(() => {
        (async () => {
            setCargando(true);
            const respuesta = await getMessages(receiver);
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
        const messages = data.get('mensaje')
        const receiver = data.get('receptor')
        const created_at = new Date().toISOString()
        const respuesta = await sendMessage({ receiver, messages, created_at });
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
            payload: respuesta
        })
        form.reset()
        return
    }
    const editmessage = async (data)=>{
        setCargando(true);
        const result = await editMessage(data)
        if(result){
            dispatch({
                type: 'EDIT',
                payload: data
            })
            return;
        }
        setCargando(false);
        setError(true);
        setMensajeError('Error editing your message. Try again later');
        return;
    }
    const deletemessage = async (id)=>{
        setCargando(true)
        const result = await deleteMessage(id)
        if(result){
            dispatch({
                type: 'DELETE',
                payload: {id}
            })
            return;
        }
        setCargando(false);
        setError(true);
        setMensajeError('Error deleting your message. Try again later');
        return;
    }
    const cerrarSesion = async () => {
        await Logout();
        window.location.href = '/Login'
    }
    const closeAlert = () => {
        setError(false);
        setMensajeError('');
    }

    return { cargando, error, mensajeError, state,editmessage, deletemessage, handleSubmit, cerrarSesion, closeAlert }
}