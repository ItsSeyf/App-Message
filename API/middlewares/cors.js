import cors from 'cors'
import jwt from 'jsonwebtoken';
export const acceptedOrigins=[
    'http://192.168.137.126:5173',
    'http://localhost:5173'
]

export const corsMiddleware=({accepted_origins= acceptedOrigins}={})=>cors({
    origin :(origin, callback)=>{
        if(accepted_origins.includes(origin)){
        return callback(null, true)
        }
        if(!origin){ return callback(null, true)}
        return callback(new Error('Origin not allowed by CORS'))
    },
    credentials: true
})

export const tokenisvalid=(req, res, next)=>{
    const token = req.cookies?.access_token;
    if(!token){
        return res.status(401).json({error: 'Token required'})
    }
    try{
        req.user=jwt.verify(token, process.env.SECRET_KEY);
        return next();
    }catch{
        res.clearCookie('access_token')
        return res.status(401).json({error: 'Invalid token'})
    }
}