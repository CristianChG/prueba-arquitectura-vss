import React, { useState } from 'react';
import { Box, Typography, Alert } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { AuthAPI } from '@api/AuthAPI';
import { APP_ROUTES } from '@constants/AppRoutes';
import { AuthTemplate } from '@presentation/components/templates/AuthTemplate';

import { FormField } from '@molecules/FormField';
import { Button } from '@atoms/Button';
import { emailValidator } from '@domain/factories/AuthValidatorFactory';

export const ForgotPasswordPage: React.FC = () => {
    const [email, setEmail] = useState('');
    const [message, setMessage] = useState<string | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);
    const [emailError, setEmailError] = useState('');
    const [cooldown, setCooldown] = useState(0);

    const navigate = useNavigate();
    const authAPI = new AuthAPI();

    React.useEffect(() => {
        const checkCooldown = () => {
            const storedTime = localStorage.getItem('forgotPasswordCooldown');
            if (storedTime) {
                const remaining = Math.ceil((parseInt(storedTime) - Date.now()) / 1000);
                if (remaining > 0) {
                    setCooldown(remaining);
                } else {
                    localStorage.removeItem('forgotPasswordCooldown');
                    setCooldown(0);
                }
            }
        };

        checkCooldown();
        const interval = setInterval(() => {
            setCooldown((prev) => {
                if (prev <= 1) {
                    localStorage.removeItem('forgotPasswordCooldown');
                    return 0;
                }
                return prev - 1;
            });
        }, 1000);

        return () => clearInterval(interval);
    }, []);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        // Validate email
        const emailValidation = emailValidator.validate(email);
        if (!emailValidation.isValid) {
            setEmailError(emailValidation.error || 'Correo inválido');
            return;
        }
        setEmailError('');

        setLoading(true);
        setError(null);
        setMessage(null);

        try {
            await authAPI.forgotPassword(email);
            setMessage('Si el correo existe, se ha enviado un código de recuperación.');

            // Set cooldown
            // const cooldownTime = 60;
            // setSuccess(true); // Removed undefined call
            // Navigate to reset password page after a short delay or immediately
            // Passing email in state so user doesn't have to re-enter it
            setTimeout(() => {
                navigate(APP_ROUTES.RESET_PASSWORD, { state: { email } });
            }, 1500);

        } catch (err: any) {
            setError(err.message || 'Error al solicitar recuperación');
        } finally {
            setLoading(false);
        }
    };

    const handleBackToLogin = () => {
        navigate(APP_ROUTES.LOGIN);
    };

    return (
        <AuthTemplate
            title="Recuperar Contraseña"
            subtitle="Ingresa tu correo para recibir un código"
            footerText="¿Ya tienes cuenta?"
            footerLinkText="Inicia sesión"
            onFooterLinkClick={handleBackToLogin}
        >
            {message && <Alert severity="success" sx={{ mb: 2 }}>{message}</Alert>}
            {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

            <Box component="form" onSubmit={handleSubmit} noValidate sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                <FormField
                    label="Correo Electrónico"
                    error={!!emailError}
                    helperText={emailError}
                    inputProps={{
                        id: "email",
                        name: "email",
                        autoComplete: "email",
                        autoFocus: true,
                        value: email,
                        onChange: (e) => {
                            setEmail(e.target.value);
                            setEmailError('');
                        },
                        disabled: loading || cooldown > 0,
                        placeholder: "juan.perez@example.com"
                    }}
                />

                <Button
                    type="submit"
                    fullWidth
                    variant="contained"
                    disabled={loading || cooldown > 0}
                    label={loading ? 'Enviando...' : cooldown > 0 ? `Enviar Código (${cooldown}s)` : 'Enviar Código'}
                    isLoading={loading}
                    sx={{ mt: 1 }}
                />

                <Box sx={{ textAlign: 'center', mt: 2 }}>
                    <Typography
                        variant="body2"
                        color="primary"
                        sx={{ cursor: 'pointer', textDecoration: 'none' }}
                        onClick={() => navigate('/reset-password')}
                    >
                        Ya tengo un código
                    </Typography>
                </Box>
            </Box>
        </AuthTemplate>
    );
};
