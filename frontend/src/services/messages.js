import { io } from 'socket.io-client';
const url = 'http://192.168.137.126:1234';

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
        return response.status=== 404 ?  404 : 201;
    }
    catch (e) {
        console.error(e);
        return 500
    }
}

export const loginUser = async (datos) => {
    try {
        const response = await fetch(`${url}/messages/login`, {
            method: 'POST',
            credentials: 'include',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(datos)
        })
        console.log(response)
        if(response.status === 403){
            return 403;
        }
        return response.status=== 404 ? 404 : 200;
    }
    catch (e) {
        console.error(e);
        return 500
    }
}

export const getMessages = async (data) => {
    try {
        const response = await fetch(`${url}/messages?receiver=${data}`,{
            method: 'GET',
            credentials: 'include'
        })
        const result = await response.json();
        if (response.status===401) return 401
        return response.status === 400 ? 400 : result;
    } catch (e) {
        console.error(e)
        return 500
    }
}

export const socket = io(url, {
    autoConnect: false,
    withCredentials: true,
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
    if(response.status === 404) return 404
    if(response.status === 401) return 401
    return result;
    }catch(e){
        console.error(e);
        return 500
    }
}

export const Logout = async ()=>{
    try{
        await fetch(`${url}/messages/logout`, {
            method: 'POST',
            credentials: 'include'
        })
        return 200
    }catch(e){
        console.error(e);
        return 500
    }
}

export const getAgenda = async ()=>{
    try{
        const response = await fetch(`${url}/messages/agenda`, {
            method: 'GET',
            credentials: 'include'
        })
        const result = await response.json();
        if(result.length ===0){
            return null;
        }else if(response.status === 401){
            return 401
        }
        return result;
    }catch(e){
        console.error(e);
        return 500
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
            body: JSON.stringify({receiver} )
        })
        const result = await response.json();
        if(response.status === 404){
            return 404
        }else if(response.status === 400){
            return 400
        }else if(response.status === 401){
            return 401;
        }
        return result;
    }
    catch(e){
        console.error(e);
        return 500
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
        if(response.status === 404){
            return 404
        }else if(response.status ===400){
            return 400
        }else if(response.status === 401){
            return 401
        }
        return result;
    }
    catch(e){
        console.error(e);
        return 500
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
        if(response.status === 401)return 401
        if(response.status === 400) return 400
        if (response.status === 500) return 500
        return result;
    }
    catch(e){
        console.error(e);
        return 500
    }
}

export const getBlockedUsers = async () =>{
    try{
        const response = await fetch(`${url}/messages/blocked`, {
            method: 'GET',
            credentials: 'include'
        })
        const result = await response.json();
        if(response.status === 401){
            return 401
        }else if(response.status === 500){
            return 500
        }
        return result;
    } catch(e){
        console.error(e);
        return 500
    }
}

export const editMessage = async (data)=>{
    try{
        console.log(data)
        const response = await fetch(`${url}/messages/`,{
            method: 'PATCH',
            credentials: 'include',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        })
        const result = await response.json();
        return response.status === 500 ? 500: result;
    }catch (e){
        console.error(e);
        return 500
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
        return response.status === 500 ? 500 : result;
    }catch(e){
        console.error(e);
        return 500
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
