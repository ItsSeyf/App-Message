import { loginUser } from '../services/messages.js'
import { useState } from "react";

export function useLogin() {
    const [error, setError] = useState(false);
    const [errormessage, setErrorMessage] = useState('');
    const [cargando, setCargando] = useState(false);
    const handleSubmit = async (event) => {
        setCargando(true);
        if (error) {
            event.preventDefault();
            setCargando(false);
            return;
        }
        event.preventDefault();
        const form = event.currentTarget;
        const data = new FormData(form);
        const username = data.get('user')
        const password = data.get('pass')
        try {
            const respuesta = await loginUser({ username, password });
            if (respuesta === 200) {
                setCargando(false);
                form.reset()
                window.location.href = '/'
                return
            } else if (respuesta === 404) {
                setError(true);
                setErrorMessage('The username or password is incorrect.');
            }else if(respuesta === 403){
                setError(true);
                setErrorMessage('The user is blocked. Login limit attempts reached.')
            }
            setCargando(false);
            setError(true);
            setErrorMessage('Server error. Try again later.');
        } catch (error) {
            setCargando(false);
            console.error('Error en la solicitud:', error)
        }
    }
    const closeAlert = () => {
        setError(false);
        setErrorMessage('');
    }

    return {
        error, errormessage, closeAlert,
        cargando,
        handleSubmit
    }
}