import { AuthFooter } from '@/components/auth/AuthFooter';
import { AppButton } from '@/components/ui/AppButton';
import { AppInput } from '@/components/ui/AppInput';
import { AppLogo } from '@/components/ui/AppLogo';
import { colors } from '@/constants/theme';
import { useAuth } from '@/contexts/AuthContext';
import { api } from '@/services/api';
import { router } from 'expo-router';
import { useState } from 'react';
import { Alert, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

export default function SignInScreen() {
    const { setAuth, setUser } = useAuth();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleLogin = async () => {
        if (!email.trim() || !email.includes('@')) {
            setError('Veuillez entrer une adresse email valide');
            return;
        }
        if (password.length < 6) {
            setError('Le mot de passe doit contenir au moins 6 caractères');
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
                  throw new Error('Impossible de récupérer l\'ID utilisateur');
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
                throw new Error('Réponse invalide du serveur');
            }
        } catch (err: any) {
            const message = err?.message || 'Erreur lors de la connexion';
            setError(message);
            Alert.alert('Erreur', message);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <>
            <AppLogo />

            <View style={styles.card}>
                <Text style={styles.title}>Connexion</Text>
                <Text style={styles.subtitle}>Bon retour parmi nous !</Text>

                <AppInput
                    placeholder="Adresse email"
                    value={email}
                    onChangeText={setEmail}
                />
                <AppInput
                    placeholder="Mot de passe"
                    secureTextEntry
                    value={password}
                    onChangeText={setPassword}
                />

                {error && (
                    <Text style={styles.errorText}>{error}</Text>
                )}

                <TouchableOpacity>
                    <Text style={styles.forgot}>Mot de passe oublié ?</Text>
                </TouchableOpacity>

                <AppButton
                    title={isSubmitting ? 'Connexion...' : 'Se connecter'}
                    onPress={handleLogin}
                    disabled={isSubmitting}
                />

                <View style={styles.footer}>
                    <AuthFooter
                        question="Pas encore de compte ?"
                        actionText="S'inscrire"
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
        backgroundColor: colors.white,
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
        color: colors.textSecondary,
        marginBottom: 25,
    },
    forgot: {
        color: colors.primary,
        textAlign: 'right',
        marginBottom: 20,
    },
    footer: {
        marginTop: 'auto',
        paddingTop: 12,
        marginBottom: 24,
    },
    errorText: {
        color: '#EF4444',
        fontSize: 14,
        marginBottom: 12,
        fontWeight: '500',
    },
});