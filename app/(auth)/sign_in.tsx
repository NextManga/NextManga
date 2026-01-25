import { AuthFooter } from '@/components/auth/AuthFooter';
import { AppButton } from '@/components/ui/AppButton';
import { AppInput } from '@/components/ui/AppInput';
import { AppLogo } from '@/components/ui/AppLogo';
import { colors } from '@/constants/theme';
import { router } from 'expo-router';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

export default function SignInScreen() {
    return (
        <>
            <AppLogo />

            <View style={styles.card}>
                <Text style={styles.title}>Connexion</Text>
                <Text style={styles.subtitle}>Bon retour parmi nous !</Text>

                <AppInput placeholder="Adresse email" />
                <AppInput placeholder="Mot de passe" secureTextEntry />

                <TouchableOpacity>
                    <Text style={styles.forgot}>Mot de passe oublié ?</Text>
                </TouchableOpacity>

                <AppButton title="Se connecter" onPress={() => router.replace('/(tabs)')} />

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
});