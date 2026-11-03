import { useState, useEffect } from 'react';
import { getAgenda, addAgenda } from '../services/messages.js'

export function useAgenda() {
    const [agenda, setAgenda] = useState([]);
    const [error, setError] = useState(false);
    const [cargando, setCargando] = useState(false);
    const [mensajeError, setMensajeError] = useState('');
    useEffect(() => {
        (async () => {
            setCargando(true);
            const result = await getAgenda();
            if (result === 500) {
                setError(true);
                setMensajeError('Server error while getting agenda. Try again later.');
                setCargando(false);
                return;
            } else if (result.status === 401) {
                setCargando(false);
                window.location.href = '/'
                return;
            }
            setAgenda(result);
            setCargando(false);
        })
    }, [])
    const closeAlert = ()=>{
        setError(false);
        setMensajeError('');
    }
    const handleSubmit = async (event) => {
        setCargando(true);
        event.preventDefault();
        const data = new FormData(event.target);
        const receiver = data.get('receiver');
        const result = await addAgenda(receiver);
        if (result.status === 404) {
            setError(true);
            setMensajeError('User not found. Cannot add to agenda.');
            setCargando(false);
        } else if (result.status === 500) {
            setError(true);
            setMensajeError('Server error while adding to agenda. Try again later.');
            setCargando(false);
        }
        const newagenda = await getAgenda();
        setAgenda(newagenda);
        setCargando(false);
        return result;
    }
    const removeFromAgenda = async (receiver) => {
        setCargando(true);
        const result = await fetch(`${url}/block`, {
            method: 'POST',
            credentials: 'include',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ receiver })
        })
        setAgenda(agenda.filter(user => user.username !== receiver))
        setCargando(false);
    }
    return { agenda, error, cargando, mensajeError, handleSubmit, removeFromAgenda, closeAlert };
}