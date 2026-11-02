import {unblockUser, getBlockedUsers} from '../services/messages.js'
import {useState, useEffect} from 'react'
export default function Blocked(){
    const [blockedUsers, setBlockedUsers] = useState([]);
    const [cargando, setCargando] = useState(false);
    const [error, setError] = useState(false);
    const [mensajeError, setMensajeError] = useState('');
    useEffect(()=>{
        (async()=>{
            setCargando(true);
            const result = await getBlockedUsers();
            if(result.status === 500){
                setError(true);
                setMensajeError('Server error while getting blocked users. Try again later.');
                setCargando(false);
                return;
            } else if(result.status === 401){
                setCargando(false);
                window.location.href = '/'
                return;
            }
            setBlockedUsers(result);
            setCargando(false); 
        })
    })
    const handleUnblockUser = async (event)=>{
        setError(false);
        setMensajeError('');
        setCargando(true);
        event.preventDefault();
        const data = new FormData(event.target);
        const blocked = data.get('blocked');
        const result = await unblockUser(blocked);
        if(result.status === 404){
            setError(true);
            setMensajeError('User not found. Cannot unblock user.');
            setCargando(false);
            return;
        }else if(result.status === 500){
            setError(true);
            setMensajeError('Server error while unblocking user. Try again later.');
            setCargando(false);
            return;
        }
        setCargando(false);
    }
    return(
        <Material.Container sx={{ display: 'flex', flexDirection: 'row', gap: 2, height: '92vh', padding: 2 }}>

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
                    Blocked Users
                </Material.Typography>
                {blockedUsers.length > 0 ? (
                    blockedUsers.map((person, index) => (
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
                            onclick={()=> handleUnblockUser(person.username)}
                                variant="contained"
                                color="secondary"
                                disabled={cargando}
                            >
                                {cargando ? 'Unblocking...' : 'Unblock User'}
                            </Material.Button>
                        </Material.Box>
                    ))
                ) : (
                    <Material.Typography variant="body2" color="textSecondary">
                        No blocked users.
                    </Material.Typography>
                )}
            </Material.Box>
        </Material.Container>
    )
}