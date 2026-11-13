import {unblockUser, getBlockedUsers} from '../services/messages.js'
import {useState, useEffect} from 'react'
export function useBlock(){
    const [blockedUsers, setBlockedUsers] = useState([]);
    const [cargando, setCargando] = useState(false);
    const [error, setError] = useState(false);
    const [mensajeError, setMensajeError] = useState('');
    useEffect(()=>{
        (async()=>{
            setCargando(true);
            const result = await getBlockedUsers();
            if(result === 500){
                setError(true);
                setMensajeError('Server error while getting blocked users. Try again later.');
                setCargando(false);
                return;
            } else if(result === 401){
                setCargando(false);
                window.location.href = '/Login'
                return;
            }
            setBlockedUsers(result);
            setCargando(false); 
        })()
    }, [])
    const handleUnblockUser = async (event)=>{
        setError(false);
        setMensajeError('');
        setCargando(true);
        event.preventDefault();
        const form = event.currentTarget;
        const data = new FormData(form);
        const blocked = data.get('blocked');
        const result = await unblockUser(blocked);
        if(result === 400){
            setError(true);
            setMensajeError('Select an user');
            setCargando(false);
            return;
        }else if(result === 500){
            setError(true);
            setMensajeError('Server error while unblocking user. Try again later.');
            setCargando(false);
            return;
        }else if (result === 401) {
            setCargando(false);
            form.reset();
            window.location.href = '/Login'
            return
        }
        setBlockedUsers(blockedUsers.filter(user => user.username !== blocked))
        setCargando(false);
    }
    const closeAlert = ()=>{
        setError(false);
        setMensajeError('');
    }
    return {blockedUsers, cargando, error, mensajeError, handleUnblockUser, closeAlert};
}