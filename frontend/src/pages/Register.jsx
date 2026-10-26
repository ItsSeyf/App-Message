import { useState } from "react";
import * as Material from "@mui/material";
import { registerUser } from  '../services/messages.js'

export default function Register() {
    const [errorUsuario, setErrorUsuario]=useState(false);
    const [errorContra, setErrorContra]=useState(false);
    const [errorname , setErrorName]= useState(false);
    const [errornamemensaje , setErrorNamemensaje]= useState('');
    const [errormensajeUsuario, setErrorMensajeUsuario]=useState('');
    const [errormensajeContra, setErrorMensajeContra]=useState('');
    const [cargando, setCargando]=useState(false);
    const validar =()=>{
        let valido=true;
        const usuario= document.getElementById('user');
        const contra= document.getElementById('pass');
        const name = document.getElementById('name');
        if(name.value === undefined || name.value.length < 2){
            setErrorName(true);
            setErrorNamemensaje('El nombre debe de tener al menos 2 caracteres');
            valido=false;
        }
        if(usuario.value.length < 2){
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
        const name = data.get('name')
        try{
            const respuesta = await registerUser({username: usuario, password: contra, name})
        if(respuesta.statusCode === 201){
            setCargando(false);
            sessionStorage.setItem('user', JSON.stringify(usuario))
            form.reset()
            window.location.href='/Home'
            return;
        }else if (respuesta.statusCode === 404){
            setCargando(false);
            setErrorUsuario(true);
            setErrorMensajeUsuario('Ese usuario ya existe');
            return;
        }
        setCargando(false);
        setErrorUsuario(true);
        setErrorMensajeUsuario('Error en el servidor, intentalo mas tarde');
        console.error(respuesta);
        }catch(error){
            setCargando(false);
            console.error('Error en la solicitud:', error)
        }
    }
    return(
        <Material.Container>
            <Material.Typography component="h1" variant="h4" sx= {{ width : '100%', fontSize: 'clamp(2rem, 10vw, 2.15rem)'}}>
                Registrarse
            </Material.Typography>
            <Material.Box component="form" onSubmit={handleSubmit} sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                <Material.FormControl>
                    <Material.FormLabel htmlFor="user">
                        Nombre
                    </Material.FormLabel>
                    <Material.TextField
                    autoComplete="name"
                    name="name"
                    required
                    fullWidth
                    id="name"
                    placeholder="Pepe Perez"
                    error={errorname}
                    helperText={errornamemensaje}
                    color={errorUsuario ? 'error' : 'primary'}/>
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
                    {cargando ? 'Registrando...': 'Registrarse'}
                </Material.Button>
            </Material.Box>
            <br/>
            <br/>
            <Material.Divider>
                Ya tienes una cuenta?
            </Material.Divider>
            <br/>
            <Material.Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                <Material.Link href="/Login" variant="body2" color="primary">
                Iniciar Sesion
                </Material.Link>
            </Material.Box>
        </Material.Container>
    )
}