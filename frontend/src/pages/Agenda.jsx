import { useState, useEffect } from 'react';
import { getAgenda, addAgenda } from '../services/messages.js'

export default function Agenda() {
    const [agenda, setAgenda] = useState([]);
    const [error, setError] = useState(false);
    const [cargando, setCargando] = useState(false);
    const [mensajeError, setMensajeError] = useState('');
    useEffect(() => {
        (async () => {
            setCargando(true);
            const result = await getAgenda();
            if (result === 500) {
                setError(true);
                setMensajeError('Server error while getting agenda. Try again later.');
                setCargando(false);
                return;
            } else if (result.status === 401) {
                setCargando(false);
                window.location.href = '/'
                return;
            }
            setAgenda(result);
            setCargando(false);
        })
    }, [])
    const handleSubmit = async (event) => {
        setCargando(true);
        event.preventDefault();
        const data = new FormData(event.target);
        const receiver = data.get('receiver');
        const result = await addAgenda(receiver);
        if (result.status === 404) {
            setError(true);
            setMensajeError('User not found. Cannot add to agenda.');
            setCargando(false);
        } else if (result.status === 500) {
            setError(true);
            setMensajeError('Server error while adding to agenda. Try again later.');
            setCargando(false);
        }
        setCargando(false);
        return result;
    }
    const removeFromAgenda = async (receiver)=>{
        setCargando(true);
        const result = await fetch(`${url}/agenda`, {
            method: 'DELETE',
            credentials: 'include',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ receiver })
        })
        setCargando(false);
    }
    return (
        <Material.Container sx={{ display: 'flex', flexDirection: 'row', gap: 2, height: '92vh', padding: 2 }}>

            <Material.Box sx={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 2 }}>
                <Material.Typography component="h1" variant="h5">
                    Add user to Agenda
                </Material.Typography>
                <Material.Box component="form" onSubmit={handleSubmit} sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                    <Material.FormControl>
                        <Material.FormLabel htmlFor="receiver">Username</Material.FormLabel>
                        <Material.TextField
                            id="receiver"
                            name="receiver"
                            placeholder="Enter username"
                            fullWidth
                            color='primary'
                            required
                        />
                    </Material.FormControl>
                    <Material.Button
                        type="submit"
                        variant="contained"
                        color="primary"
                        disabled={cargando}
                    >
                        {cargando ? 'Adding to Agenda...' : 'Add to Agenda'}
                    </Material.Button>
                </Material.Box>
                <Material.Divider />
            </Material.Box>

            <Material.Box
                sx={{
                    flex: 2,
                    overflowY: 'auto',
                    border: '1px solid #ccc',
                    borderRadius: 2,
                    padding: 2,
                    maxHeight: '80vh'
                }}
            >
                <Material.Typography component="h1" variant="h5">
                    Agenda
                </Material.Typography>
                {agenda.length > 0 ? (
                    agenda.map((person, index) => (
                        <Material.Box
                            key={index}
                            sx={{
                                marginBottom: 2,
                                padding: 2,
                                border: '1px solid #ddd',
                                borderRadius: 2,
                                backgroundColor: '#FFCDD2',
                                color: '#333333'
                            }}
                        >
                            <Material.Typography variant="body2" sx={{ marginTop: 1 }}>
                                {person.name}
                            </Material.Typography>
                            <Material.Typography variant="body2" sx={{ marginTop: 1 }}>
                                {person.username}
                            </Material.Typography>
                            <Material.Button
                            onclick={()=> removeFromAgenda(person.username)}
                                variant="contained"
                                color="secondary"
                                disabled={cargando}
                            >
                                {cargando ? 'Blocking...' : 'Block User'}
                            </Material.Button>
                        </Material.Box>
                    ))
                ) : (
                    <Material.Typography variant="body2" color="textSecondary">
                        Empty agenda.
                    </Material.Typography>
                )}
            </Material.Box>
        </Material.Container>
    )
}