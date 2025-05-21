import { Link } from '../components/Link.jsx';

export default function Page404(){
    return(
        <div>
            <h1>404</h1>
            <h2>Pagina no encontrada</h2>
            <Link to='/'>Volver a la pagina de inicio</Link>
        </div>
    )
}