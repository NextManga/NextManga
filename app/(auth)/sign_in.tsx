import { AuthFooter } from '@/components/auth/AuthFooter';
import { AppButton } from '@/components/ui/AppButton';
import { AppInput } from '@/components/ui/AppInput';
import { AppLogo } from '@/components/ui/AppLogo';
import { useAuth } from '@/contexts/AuthContext';
import { useThemeColors } from '@/hooks/useThemeColors';
import { api } from '@/services/api';
import { router } from 'expo-router';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Alert, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

export default function SignInScreen() {
    const { setAuth, setUser } = useAuth();
    const colors = useThemeColors();
    const { t } = useTranslation();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleLogin = async () => {
        if (!email.trim() || !email.includes('@')) {
            setError(t('ui.auth.signIn.invalidEmail'));
            return;
        }
        if (password.length < 6) {
            setError(t('ui.auth.signIn.invalidPassword'));
            return;
        }

        try {
            setError(null);
            setIsSubmitting(true);

            const response = await api.login({
                email: email.trim(),
                password,
            });

            if (response) {
                const userId = response.user?._id || response._id;
                const token = response.token || 'auth-token';

                console.log('✅ Login Success - userId:', userId);

                if (!userId) {
                                    throw new Error(t('ui.auth.signIn.missingUserId'));
                }

                // Sauvegarder userId et token
                setAuth(userId, token);

                // Récupérer les données complètes de l'utilisateur
                try {
                  const userProfile = await api.getUser(userId, token);
                  setUser(userProfile);
                } catch (err) {
                  // Si on ne peut pas récupérer le profil, continuer quand même
                  console.warn('Impossible de récupérer le profil:', err);
                  setUser({
                    _id: userId,
                    email: response.user?.email || response.email || email,
                    displayName: response.user?.displayName || 'User',
                  });
                }

                router.replace('/(tabs)');
            } else {
                throw new Error(t('ui.auth.signIn.invalidServerResponse'));
            }
        } catch (err: any) {
            const message = err?.message || t('ui.auth.signIn.loginError');
            setError(message);
            Alert.alert(t('common.errorTitle'), message);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <>
            <AppLogo />

            <View style={[styles.card, { backgroundColor: colors.surfacePrimary }]}>
                <Text style={[styles.title, { color: colors.textPrimary }]}>{t('ui.auth.signIn.title')}</Text>
                <Text style={[styles.subtitle, { color: colors.textSecondary }]}>{t('ui.auth.signIn.subtitle')}</Text>

                <AppInput
                    placeholder={t('ui.auth.signIn.emailPlaceholder')}
                    value={email}
                    onChangeText={setEmail}
                />
                <AppInput
                    placeholder={t('ui.auth.signIn.passwordPlaceholder')}
                    secureTextEntry
                    value={password}
                    onChangeText={setPassword}
                />

                {error && (
                    <Text style={[styles.errorText, { color: colors.error }]}>{error}</Text>
                )}

                <TouchableOpacity>
                    <Text style={[styles.forgot, { color: colors.primary }]}>{t('ui.auth.signIn.forgotPassword')}</Text>
                </TouchableOpacity>

                <AppButton
                    title={isSubmitting ? t('ui.auth.signIn.submitting') : t('ui.auth.signIn.submit')}
                    onPress={handleLogin}
                    disabled={isSubmitting}
                />

                <View style={styles.footer}>
                    <AuthFooter
                        question={t('ui.auth.signIn.noAccount')}
                        actionText={t('ui.auth.signIn.signUpAction')}
                        onPress={() => router.push('/sign_up')}
                    />
                </View>
            </View>
        </>
    );
}

const styles = StyleSheet.create({
    card: {
        flex: 1,
        borderTopLeftRadius: 40,
        borderTopRightRadius: 40,
        padding: 24,
    },
    title: {
        fontSize: 22,
        fontWeight: '700',
        marginBottom: 4,
    },
    subtitle: {
        marginBottom: 25,
    },
    forgot: {
        textAlign: 'right',
        marginBottom: 20,
    },
    footer: {
        marginTop: 'auto',
        paddingTop: 12,
        marginBottom: 24,
    },
    errorText: {
        fontSize: 14,
        marginBottom: 12,
        fontWeight: '500',
    },
});