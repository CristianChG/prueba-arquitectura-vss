import React, { useState, useEffect } from 'react';
import { Box, Alert, Typography, Stepper, Step, StepLabel } from '@mui/material';
import { useNavigate, useLocation } from 'react-router-dom';
import { AuthAPI } from '@api/AuthAPI';
import { APP_ROUTES } from '@constants/AppRoutes';
import { AuthTemplate } from '@presentation/components/templates/AuthTemplate';
import { FormField } from '@molecules/FormField';
import { Button } from '@atoms/Button';
import { CheckCircle, Cancel } from '@mui/icons-material';
import { APP_CONFIG } from '@constants/appConfig';

export const ResetPasswordPage: React.FC = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const authAPI = new AuthAPI();

    const [activeStep, setActiveStep] = useState(0);
    const [email, setEmail] = useState('');
    const [code, setCode] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [message, setMessage] = useState<string | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (location.state?.email) {
            setEmail(location.state.email);
        } else {
            // Redirect to forgot password if no email in state
            navigate(APP_ROUTES.FORGOT_PASSWORD);
        }
    }, [location, navigate]);

    // Password Policies Logic
    const passwordPolicies = {
        minLength: newPassword.length >= APP_CONFIG.PASSWORD_MIN_LENGTH,
        hasUppercase: /[A-Z]/.test(newPassword),
        hasLowercase: /[a-z]/.test(newPassword),
        hasNumber: /[0-9]/.test(newPassword),
    };

    const allPasswordPoliciesMet =
        passwordPolicies.minLength &&
        passwordPolicies.hasUppercase &&
        passwordPolicies.hasLowercase &&
        passwordPolicies.hasNumber;

    const handleVerifyCode = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);
        setLoading(true);

        try {
            await authAPI.verifyCode(email, code);
            setActiveStep(1);
        } catch (err: any) {
            setError(err.message || 'Código inválido');
        } finally {
            setLoading(false);
        }
    };

    const handleResetPassword = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);

        if (newPassword !== confirmPassword) {
            setError('Las contraseñas no coinciden');
            return;
        }

        if (!allPasswordPoliciesMet) {
            setError('La contraseña no cumple con los requisitos de seguridad');
            return;
        }

        setLoading(true);

        try {
            await authAPI.resetPassword(email, code, newPassword);
            setMessage('Contraseña restablecida exitosamente. Redirigiendo al login...');
            setTimeout(() => {
                navigate(APP_ROUTES.LOGIN);
            }, 3000);
        } catch (err: any) {
            setError(err.message || 'Error al restablecer contraseña');
        } finally {
            setLoading(false);
        }
    };

    const handleBackToLogin = () => {
        navigate(APP_ROUTES.LOGIN);
    };

    const steps = ['Validar Código', 'Nueva Contraseña'];

    return (
        <AuthTemplate
            title="Restablecer Contraseña"
            subtitle={activeStep === 0 ? "Ingresa el código que enviamos a tu correo" : "Crea una nueva contraseña segura"}
            footerText="¿Ya recordaste tu contraseña?"
            footerLinkText="Inicia sesión"
            onFooterLinkClick={handleBackToLogin}
        >
            <Stepper activeStep={activeStep} alternativeLabel sx={{ mb: 4 }}>
                {steps.map((label) => (
                    <Step key={label}>
                        <StepLabel>{label}</StepLabel>
                    </Step>
                ))}
            </Stepper>

            {message && <Alert severity="success" sx={{ mb: 2 }}>{message}</Alert>}
            {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

            {activeStep === 0 ? (
                <Box component="form" onSubmit={handleVerifyCode} noValidate sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                    <Typography variant="body2" color="textSecondary" align="center">
                        Hemos enviado un código de 6 dígitos a <strong>{email}</strong>
                    </Typography>
                    <FormField
                        label="Código de Verificación"
                        inputProps={{
                            id: "code",
                            name: "code",
                            value: code,
                            onChange: (e) => setCode(e.target.value),
                            disabled: loading,
                            placeholder: "123456",
                            autoFocus: true
                        }}
                    />
                    <Button
                        type="submit"
                        fullWidth
                        variant="contained"
                        disabled={loading || code.length < 4}
                        label={loading ? 'Verificando...' : 'Verificar Código'}
                        isLoading={loading}
                        sx={{ mt: 1 }}
                    />
                </Box>
            ) : (
                <Box component="form" onSubmit={handleResetPassword} noValidate sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                    <FormField
                        label="Nueva Contraseña"
                        inputProps={{
                            id: "newPassword",
                            name: "newPassword",
                            type: "password",
                            value: newPassword,
                            onChange: (e) => setNewPassword(e.target.value),
                            disabled: loading,
                            placeholder: "********",
                            autoFocus: true
                        }}
                    />

                    {/* Password Policies Feedback */}
                    {newPassword && (
                        <Box sx={{ mt: 0, display: "flex", flexDirection: "column", gap: 0.5 }}>
                            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                                {passwordPolicies.minLength ? (
                                    <CheckCircle sx={{ fontSize: 16, color: "success.main" }} />
                                ) : (
                                    <Cancel sx={{ fontSize: 16, color: "error.main" }} />
                                )}
                                <Typography variant="caption" color={passwordPolicies.minLength ? "success.main" : "error.main"}>
                                    Mínimo {APP_CONFIG.PASSWORD_MIN_LENGTH} caracteres
                                </Typography>
                            </Box>
                            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                                {passwordPolicies.hasUppercase ? (
                                    <CheckCircle sx={{ fontSize: 16, color: "success.main" }} />
                                ) : (
                                    <Cancel sx={{ fontSize: 16, color: "error.main" }} />
                                )}
                                <Typography variant="caption" color={passwordPolicies.hasUppercase ? "success.main" : "error.main"}>
                                    Al menos una letra mayúscula
                                </Typography>
                            </Box>
                            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                                {passwordPolicies.hasLowercase ? (
                                    <CheckCircle sx={{ fontSize: 16, color: "success.main" }} />
                                ) : (
                                    <Cancel sx={{ fontSize: 16, color: "error.main" }} />
                                )}
                                <Typography variant="caption" color={passwordPolicies.hasLowercase ? "success.main" : "error.main"}>
                                    Al menos una letra minúscula
                                </Typography>
                            </Box>
                            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                                {passwordPolicies.hasNumber ? (
                                    <CheckCircle sx={{ fontSize: 16, color: "success.main" }} />
                                ) : (
                                    <Cancel sx={{ fontSize: 16, color: "error.main" }} />
                                )}
                                <Typography variant="caption" color={passwordPolicies.hasNumber ? "success.main" : "error.main"}>
                                    Al menos un número
                                </Typography>
                            </Box>
                        </Box>
                    )}

                    <FormField
                        label="Confirmar Nueva Contraseña"
                        inputProps={{
                            id: "confirmPassword",
                            name: "confirmPassword",
                            type: "password",
                            value: confirmPassword,
                            onChange: (e) => setConfirmPassword(e.target.value),
                            disabled: loading,
                            placeholder: "********"
                        }}
                    />

                    {confirmPassword && (
                        <Box sx={{ mt: 0, display: "flex", alignItems: "center", gap: 1 }}>
                            {newPassword === confirmPassword ? (
                                <>
                                    <CheckCircle sx={{ fontSize: 16, color: "success.main" }} />
                                    <Typography variant="caption" color="success.main">Las contraseñas coinciden</Typography>
                                </>
                            ) : (
                                <>
                                    <Cancel sx={{ fontSize: 16, color: "error.main" }} />
                                    <Typography variant="caption" color="error.main">Las contraseñas no coinciden</Typography>
                                </>
                            )}
                        </Box>
                    )}

                    <Button
                        type="submit"
                        fullWidth
                        variant="contained"
                        disabled={loading || !allPasswordPoliciesMet || newPassword !== confirmPassword}
                        label={loading ? 'Restableciendo...' : 'Restablecer Contraseña'}
                        isLoading={loading}
                        sx={{ mt: 1 }}
                    />
                </Box>
            )}
        </AuthTemplate>
    );
};
