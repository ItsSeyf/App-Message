import { io } from "https://cdn.socket.io/4.8.1/socket.io.esm.min.js";
const url = 'http://localhost:1234';

export const registerUser = async (datos) => {
    try {
        const response = await fetch(`${url}/messages/register`, {
            method: 'POST',
            credentials: 'include',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(datos)
        })
        return response.status=== 404 ? {status: 404} : {status: 201};
    }
    catch (e) {
        console.error(e);
        return { status: 500, message: e }
    }
}

export const loginUser = async (datos) => {
    try {
        console.log('antes API')
        const response = await fetch(`${url}/messages/login`, {
            method: 'POST',
            credentials: 'include',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(datos)
        })
        console.log('regreso API')
        if(response.status === 403){
            return 1;
        }
        return response.status=== 404 ? null : {status: 200};
    }
    catch (e) {
        console.error(e);
        return { status: 500, message: e }
    }
}

export const getMessages = async (data) => {
    try {
        const response = await fetch(`${url}/messages/`,{
            method: 'GET',
            credentials: 'include',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        })
        const result = await response.json();
        return response.status === 400 ? null : result;
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
        const response = await fetch(`${url}/messages/`, {
        method: 'POST',
        credentials: 'include',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(datos)
    })
    const result = await response.json();
    if(response.status === 404){
        return null;
    }
    return result;
    }catch(e){
        console.error(e);
        return {status: 500}
    }
}

export const Logout = async ()=>{
    try{
        await fetch(`${url}/messages/logout`, {
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
        const response = await fetch(`${url}/messages/agenda`, {
            method: 'GET',
            credentials: 'include'
        })
        const result = await response.json();
        if(response.status === 404){
            return {status: 404};
        }else if(response.status === 401){
            window.location.href = '/Login'
            return {status: 401}
        }
        return result;
    }catch(e){
        console.error(e);
        return {status: 500}
    }
}

export const addAgenda =async (receiver)=>{
    try{
        const response = await fetch(`${url}/messages/agenda`, {
            method: 'POST',
            credentials: 'include',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(receiver )
        })
        const result = await response.json();
        return response.status === 404 || response.status ===400 ? null : result;
    }
    catch(e){
        console.error(e);
        return {status: 500}
    }
}

export const blockUser = async (blocked)=>{
    try{
        const response = await fetch(`${url}/messages/block`, {
            method: 'POST',
            credentials: 'include',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ blocked })
        })
        const result = await response.json();
        return response.status === 500 || response.status=== 400 ? null : result;
    }
    catch(e){
        console.error(e);
        return {status: 500}
    }
}

export const unblockUser = async (blocked)=>{
    try{
        const response = await fetch(`${url}/messages/unblock`, {
            method: 'POST',
            credentials: 'include',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ blocked })
        })
        const result = await response.json();
        return response.status === 500 || response.status=== 400 ? null : result;
    }
    catch(e){
        console.error(e);
        return {status: 500}
    }
}

export const getBlockedUsers = async () =>{
    try{
        const response = await fetch(`${url}/messages/blocked`, {
            method: 'GET',
            credentials: 'include'
        })
        const result = await response.json();
        return response.status === 404 ? null : result;
    } catch(e){
        console.error(e);
        return {status: 500}
    }
}

export const editMessage = async (data)=>{
    try{
        const response = await fetch(`${url}/messages/`,{
            method: 'PATCH',
            credentials: 'include',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data )
        })
        const result = await response.json();
        return response.status === 500 ? null: result;
    }catch (e){
        console.error(e);
        return {status: 500}
    }
}

export const deleteMessage = async (id)=>{
    try{
        const response = await fetch(`${url}/messages/`,{
            method: 'DELETE',
            credentials: 'include',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ id })
        })
        const result = await response.json();
        return response.status === 500 ? null : result;
    }catch(e){
        console.error(e);
        return {status: 500}
    }
}

export const getResetLink = async (data)=>{
    try{
        const response = await fetch(`${url}/messages/reset`,{
            method: 'GET',
            credentials: 'include',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ data })
        })
        const result = await response.json();
        return response.status === 500 || response.status=== 400 ? null : result;
    }catch(e){
        console.error(e);
        return {status: 500}
    }
}

export const resetPassword= async (data)=>{
    try{
        const response = await fetch(`${url}/messages/reset`,{
            method: 'POST',
            credentials: 'include',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ data })
        })
        const result = await response.json();
        return response.status === 500 || response.status=== 400 ? null : result;
    }catch(e){
        console.error(e);
        return {status: 500}
    }
}

export const getAccountDetails = async ()=>{
    try{
        const response = await fetch(`${url}/messages/account`, {
            method: 'GET',
            credentials: 'include'
        })
        const result = await response.json();
        return response.status === 404 ? null : result;
    } catch(e){
        console.error(e);
        return {status: 500}
    }
}

export const changeAccountDetails = async (data)=>{
    try{
        const response = await fetch(`${url}/messages/account`,{
            method: 'PATCH',
            credentials: 'include',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ data })
        })
        const result = await response.json();
        return response.status === 500 ? null : result;
    }catch(e){
        console.error(e);
        return {status: 500}
    }
}
