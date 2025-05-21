import cors from 'cors'
const AcceptedOrigins=[
    'http://localhost:5173',
    'http://localhost:8080',
    'http://localhost:8081',
    'http://localhost:8086',
    'http://localhost:8087'
]

export const corsMiddleware=({accepted_origins= AcceptedOrigins}={})=>cors({
    origin :(origin, callback)=>{
        if(accepted_origins.includes(origin)){
        return callback(null, true)
        }
        if(!origin){ return callback(null, true)}
        return callback(new Error('Origen no permitido'))
    }
})