import { loginUser } from '../services/messages.js'
import { useState } from "react";

export function useLogin() {
    const [error, setError] = useState(false);
    const [errormessage, setErrorMessage] = useState('');
    const [cargando, setCargando] = useState(false);
    const validar = () => {
        let valido = true;
        const usuario = document.getElementById('user');
        const contra = document.getElementById('pass');
        if (usuario.value.length < 5) {
            setError(true);
            setErrorMessage('El usuario debe de tener al menos 5 caracteres');
            valido = false;
        }
        else if (contra.value.length < 6) {
            setError(true);
            setErrorMessage('La contraseña debe de tener al menos 6 caracteres');
            valido = false;
        }
        return valido;
    }
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
        const usuario = data.get('user')
        const contra = data.get('pass')
        try {
            const respuesta = await loginUser({ username: usuario, password: contra });
            if (respuesta.status === 200) {
                setCargando(false);
                form.reset()
                window.location.href = '/Home'
                return
            } else if (respuesta === null) {
                setError(true);
                setErrorMessage('The username or password is incorrect.');
            }else if(respuesta === 1){
                setError(true);
                setErrorMessage('The user is blocked. Login limit attempts reached.')
            }
            setCargando(false);
            setError(true);
            setErrorMessage('Server error. Try again later.');
            console.error(respuesta);
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
        validar,
        handleSubmit
    }
}