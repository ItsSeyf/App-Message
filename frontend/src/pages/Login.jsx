import { useState } from "react";
import * as Material from "@mui/material";

export default function Login() {
    const [errorUsuario, setErrorUsuario]=useState(false);
    const [errorContra, setErrorContra]=useState(false);
    const [errormensajeUsuario, setErrorMensajeUsuario]=useState('');
    const [errormensajeContra, setErrorMensajeContra]=useState('');
    const [cargando, setCargando]=useState(false);
    const validar =()=>{
        let valido=true;
        const usuario= document.getElementById('user');
        const contra= document.getElementById('pass');
        if(usuario.value.length < 5){
            setErrorUsuario(true);
            setErrorMensajeUsuario('El usuario debe de tener al menos 5 caracteres');
            valido=false;
        }
        else if(contra.value.length < 6){
            setErrorContra(true);
            setErrorMensajeContra('La contraseña debe de tener al menos 6 caracteres');
            valido=false;
        }
        return valido;
    }
    const handleSubmit=async(event)=>{
        setCargando(true);
        if(errorUsuario || errorContra){
            event.preventDefault();
            setCargando(false);
            return;
        }
        event.preventDefault();
        const form =event.currentTarget;
        const data= new FormData(form);
        const usuario = data.get('user')
        const contra = data.get('pass')
        try{
            const respuesta = await fetch('http://localhost:1234/messages/login', {
                method : 'POST',
                headers : {
                    'Content-Type': 'application/json'
                },
                body : JSON.stringify({
                    username: usuario,
                    password: contra
                })
        })
        if(respuesta.ok){
            setCargando(false);
            sessionStorage.setItem('user', JSON.stringify(usuario))
            form.reset()
            window.location.href='/Home'
            return
        }
        throw new Error('Error en la respuesta del servidor')

        }catch(error){
            setCargando(false);
            console.error('Error en la solicitud:', error)
        }
    }
    return(
        <Material.Container>
            <Material.Typography component="h1" variant="h4" sx= {{ width : '100%', fontSize: 'clamp(2rem, 10vw, 2.15rem)'}}>
                Iniciar Sesion
            </Material.Typography>
            <Material.Box component="form" onSubmit={handleSubmit} sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                <Material.FormControl>
                    <Material.FormLabel htmlFor="user">
                        Nombre de usuario
                    </Material.FormLabel>
                    <Material.TextField
                    autoComplete="user"
                    name="user"
                    required
                    fullWidth
                    id="user"
                    placeholder="Pepito 123"
                    error={errorUsuario}
                    helperText={errormensajeUsuario}
                    color={errorUsuario ? 'error' : 'primary'}/>
                </Material.FormControl>
                <Material.FormControl>
                    <Material.FormLabel htmlFor="pass">
                    Contraseña
                    </Material.FormLabel>
                    <Material.TextField
                    autoComplete="pass"
                    name="pass"
                    required
                    type="password"
                    fullWidth
                    id="pass"
                    placeholder="*******"
                    error={errorContra}
                    helperText={errormensajeContra}
                    color={errorContra ? 'error' : 'primary'}/>
                </Material.FormControl>
                <Material.Button type="submit" variant="contained" color="success" onClick={validar} fullWidth disabled={cargando}>
                    {cargando ? 'Iniciando Sesion...' : 'Iniciar Sesion'}
                </Material.Button>
            </Material.Box>
            <br/>
            <br/>
            <Material.Divider>
                    No tiene una cuenta?
                </Material.Divider>
                <br/>
            <Material.Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                <Material.Box>
                    <Material.Link href="/Register" variant="body2" color="primary">
                        Registrarse
                    </Material.Link>
                </Material.Box>
            </Material.Box>
        </Material.Container>
    )
}