import { useLogin } from "../hooks/useLogin.js";
import {
    Alert,
    AlertTitle,
    Box,
    Button,
    Container,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    Divider,
    FormControl,
    FormLabel,
    Link,
    TextField,
    Typography
} from '@mui/material';

export default function Login() {
    const {error, errormessage, closeAlert,
        cargando,
        validar,
        handleSubmit} = useLogin();
    return(
        <Container>
            <Typography component="h1" variant="h4" sx= {{ width : '100%', fontSize: 'clamp(2rem, 10vw, 2.15rem)'}}>
                Log in
            </Typography>
            <Box component="form" onSubmit={handleSubmit} sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                <FormControl>
                    <FormLabel htmlFor="user">
                        Username
                    </FormLabel>
                    <TextField
                    autoComplete="user"
                    name="user"
                    required
                    fullWidth
                    id="user"
                    placeholder="Pepito 123"
                    color="primary"/>
                </FormControl>
                <FormControl>
                    <FormLabel htmlFor="pass">
                    Password
                    </FormLabel>
                    <TextField
                    autoComplete="pass"
                    name="pass"
                    required
                    type="password"
                    fullWidth
                    id="pass"
                    placeholder="*******"
                    color="primary"/>
                </FormControl>
                <Button type="submit" variant="contained" color="success" onClick={validar} fullWidth disabled={cargando}>
                    {cargando ? 'Loggin in...' : 'Log in'}
                </Button>
            </Box>
            <br/>
            <br/>
            <Divider>
                    You don't have an account?
                </Divider>
                <br/>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                <Box>
                    <Link href="/Register" variant="body2" color="primary">
                        Sing in
                    </Link>
                </Box>
            </Box>
            <Dialog
                open={error}
                onClose={closeAlert}
                aria-labelledby="error-dialog-title"
                aria-describedby="error-dialog-description"
            >
                <DialogTitle id="error-dialog-title">An error occurred</DialogTitle>
                <DialogContent>
                    <Alert severity="error" sx={{ mt: 1 }}>
                        <AlertTitle>Error</AlertTitle>
                        <span id="error-dialog-description">{errormessage}</span>
                    </Alert>
                </DialogContent>
                <DialogActions>
                    <Button onClick={closeAlert} variant="contained" color="error" autoFocus>
                        Close
                    </Button>
                </DialogActions>
            </Dialog>
        </Container>
    )
}