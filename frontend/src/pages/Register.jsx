import { useRegister } from "../hooks/useRegister.js";
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

export default function Register() {
    const { error, closeAlert, errormessage, cargando, validar, handleSubmit } = useRegister();

    return (
        <Container>
            <Typography component="h1" variant="h4" sx={{ width: '100%', fontSize: 'clamp(2rem, 10vw, 2.15rem)' }}>
                Register
            </Typography>
            <Box component="form" onSubmit={handleSubmit} sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                <FormControl>
                    <FormLabel htmlFor="user">
                        Name
                    </FormLabel>
                    <TextField
                        autoComplete="name"
                        name="name"
                        required
                        fullWidth
                        id="name"
                        placeholder="Pepe Perez"
                        color="primary" />
                </FormControl>
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
                        color="primary" />
                </FormControl>
                <FormControl>
                    <FormLabel htmlFor="user">
                        Email
                    </FormLabel>
                    <TextField
                        autoComplete="email"
                        name="email"
                        required
                        fullWidth
                        id="email"
                        type="email"
                        placeholder="Pepito@gmail.com"
                        color="primary" />
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
                        color="primary" />
                </FormControl>
                <Button type="submit" variant="contained" color="success" onClick={validar} fullWidth disabled={cargando}>
                    {cargando ? 'Registering...' : 'Register'}
                </Button>
            </Box>
            <br />
            <br />
            <Divider>
                You already have an account?
            </Divider>
            <br />
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                <Link href="/Login" variant="body2" color="primary">
                    Log in
                </Link>
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