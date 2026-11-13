import { registerUser } from '../services/messages.js'
import { useState } from "react";

export function useRegister() {
    const [error, setError] = useState(false);
    const [errormessage, setErrorMessage] = useState('');
    const [cargando, setCargando] = useState(false);
    const validar = () => {
        let valido = true;
        const usuario = document.getElementById('user');
        const contra = document.getElementById('pass');
        const name = document.getElementById('name');
        if (name.value === undefined || name.value.length < 2) {
            setError(true);
            setErrorMessage('The name must have at least 2 characters.');
            valido = false;
        }
        if (usuario.value.length < 2) {
            setError(true);
            setErrorMessage('The username must have at least 5 characters.');
            valido = false;
        }
        else if (contra.value.length < 6) {
            setError(true);
            setErrorMessage('The password must have at least 6 characters.');
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
        const username = data.get('user')
        const password  = data.get('pass')
        const name = data.get('name')
        const email = data.get('email')
        try {
            const respuesta = await registerUser({ username, password, name, email })
            if (respuesta.status === 201) {
                setCargando(false);
                form.reset()
                window.location.href = '/Home'
                return;
            } else if (respuesta.status === 404) {
                setCargando(false);
                setError(true);
                setErrorMessage('The user already exists');
                return;
            }
            setCargando(false);
            setError(true);
            setErrorMessage('Server Error. Try again later.');
            console.error(respuesta);
        } catch (error) {
            setCargando(false);
            console.error('Error en la solicitud:', error)
        }
    }
    const closeAlert = ()=>{
        setError(false);
        setErrorMessage('');
    }
    return {error,closeAlert, errormessage, cargando, validar, handleSubmit}
}