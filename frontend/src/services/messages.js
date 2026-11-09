import { io } from "https://cdn.socket.io/4.8.1/socket.io.esm.min.js";
const url = 'http://localhost:1234/';

export const registerUser = async (datos) => {
    try {
        const response = await fetch(`${url}/register`, {
            method: 'POST',
            credentials: 'include',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(datos)
        })
        const result = await response.json();
        return result.status=== 404 ? null : result;
    }
    catch (e) {
        console.error(e);
        return { status: 500, message: e }
    }
}

export const loginUser = async (datos) => {
    try {
        const response = await fetch(`${url}/login`, {
            method: 'POST',
            credentials: 'include',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(datos)
        })
        const result = await response.json();
        if(result.status === 403){
            return 1;
        }
        return result.status=== 404 ? null : result;
    }
    catch (e) {
        console.error(e);
        return { status: 500, message: e }
    }
}

export const getMessages = async (data) => {
    try {
        const response = await fetch(`${url}`,{
            method: 'GET',
            credentials: 'include',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        })
        const result = await response.json();
        return result.status === 400 ? null : result;
    } catch (e) {
        return { status: 500, message: e }
    }
}

export const socket = io("http://localhost:1234", {
    reconnection: true,
    reconnectionAttempts: 5,
    reconnectionDelay: 1000,
});

export const sendMessage = async (datos) => {
    try{
        const response = await fetch(`${url}`, {
        method: 'POST',
        credentials: 'include',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            receiver: datos.receptor,
            messages: datos.mensaje,
            fecha: datos.fecha
        })
    })
    const result = await response.json();
    return result;
    }catch(e){
        console.error(e);
        return {status: 500}
    }
}

export const Logout = async ()=>{
    try{
        await fetch(`${url}/logout`, {
            method: 'POST',
            credentials: 'include'
        })
        return {status: 200}
    }catch(e){
        console.error(e);
        return {status: 500}
    }
}

export const getAgenda = async ()=>{
    try{
        const response = await fetch(`${url}/agenda`, {
            method: 'GET',
            credentials: 'include'
        })
        const result = await response.json();
        if(result.status === 404){
            return null;
        }
        return result;
    }catch(e){
        console.error(e);
        return {status: 500}
    }
}

export const addAgenda =async (receiver)=>{
    try{
        const response = await fetch(`${url}/agenda`, {
            method: 'POST',
            credentials: 'include',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ receiver })
        })
        const result = await response.json();
        return result.status === 404 || result.status ===400 ? null : result;
    }
    catch(e){
        console.error(e);
        return {status: 500}
    }
}

export const blockUser = async (blocked)=>{
    try{
        const response = await fetch(`${url}/block`, {
            method: 'POST',
            credentials: 'include',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ blocked })
        })
        const result = await response.json();
        return result.status === 500 || result.status=== 400 ? null : result;
    }
    catch(e){
        console.error(e);
        return {status: 500}
    }
}

export const unblockUser = async (blocked)=>{
    try{
        const response = await fetch(`${url}/unblock`, {
            method: 'POST',
            credentials: 'include',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ blocked })
        })
        const result = await response.json();
        return result.status === 500 || result.status=== 400 ? null : result;
    }
    catch(e){
        console.error(e);
        return {status: 500}
    }
}

export const getBlockedUsers = async () =>{
    try{
        const response = await fetch(`${url}/blocked`, {
            method: 'GET',
            credentials: 'include'
        })
        const result = await response.json();
        return result.status === 404 ? null : result;
    } catch(e){
        console.error(e);
        return {status: 500}
    }
}

export const editMessage = async (data)=>{
    try{
        const response = await fetch(`${url}/`,{
            method: 'PATCH',
            credentials: 'include',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ data })
        })
        const result = await response.json();
        return result.status === 500 ? null: result;
    }catch (e){
        console.error(e);
        return {status: 500}
    }
}

export const deleteMessage = async (data)=>{
    try{
        const response = await fetch(`${url}/`,{
            method: 'DELETE',
            credentials: 'include',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ data })
        })
        const result = await response.json();
        return result.status === 500 ? null : result;
    }catch(e){
        console.error(e);
        return {status: 500}
    }
}

export const getResetLink = async (data)=>{
    try{
        const response = await fetch(`${url}/reset`,{
            method: 'GET',
            credentials: 'include',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ data })
        })
        const result = await response.json();
        return result.status === 500 || result.status=== 400 ? null : result;
    }catch(e){
        console.error(e);
        return {status: 500}
    }
}