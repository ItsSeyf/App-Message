import { io } from "https://cdn.socket.io/4.8.1/socket.io.esm.min.js";
const url = 'http://localhost:1234/messages';

export const registerUser = async (datos) => {
    try {
        const result = await fetch(`${url}/register`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(datos)
        })
        return result;
    }
    catch (e) {
        console.error(e);
        return { statusCode: 500, message: e }
    }
}

export const loginUser = async (datos) => {
    try {
        const result = await fetch(`${url}/login`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(datos)
        })
        return result;
    }
    catch (e) {
        console.error(e);
    }
}

export const getMessages = async (username) => {
    try {
        const result = await fetch(`${url}/?username=${username}`)
        return result;
    } catch (e) {
        return e;
    }
}

export const socket = io("http://localhost:1234", {
    reconnection: true,
    reconnectionAttempts: 5,
    reconnectionDelay: 1000,
});

export const sendMessage = async (datos) => {
    const result = await fetch(`${url}`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            sender: datos.usuario,
            receiver: datos.receptor,
            messages: datos.mensaje,
            fecha: datos.fecha
        })
    })
}