import { AuthFooter } from "@/components/auth/AuthFooter";
import { PasswordStrength } from "@/components/auth/PasswordStrength";
import { AppButton } from "@/components/ui/AppButton";
import { AppCheckbox } from "@/components/ui/AppCheckbox";
import { AppInput } from "@/components/ui/AppInput";
import { AppLogo } from "@/components/ui/AppLogo";
import { colors } from "@/constants/theme";
import { router } from "expo-router";
import { useState } from "react";
import { StyleSheet, Text, View, } from "react-native";

export default function SignUpScreen() {

    const [accepted, setAccepted] = useState(false);
    const [password, setPassword] = useState('');

    const passwordLevel = password.length === 0 ? 0 :
        password.length < 6 ? 1 :
            password.length < 10 ? 2 : 3;

    return (
        <>
            <AppLogo />
            <View style={styles.card}>
                <Text style={styles.title}>Inscription</Text>
                <Text style={styles.subtitle}>Rejoignez la communauté !</Text>
                <AppInput placeholder="Nom d'utilisateur" />
                <AppInput placeholder="Adresse email" />

                <AppInput
                    placeholder="Mot de passe"
                    secureTextEntry
                    onChangeText={setPassword}
                />
                <PasswordStrength level={passwordLevel} />

                <AppInput placeholder="Confirmer le mot de passe" secureTextEntry />
                <AppCheckbox
          checked={accepted}
          onToggle={() => setAccepted(!accepted)}
          label={
            <>
              J'accepte les{' '}
              <Text style={styles.link}>Conditions d'utilisation</Text> et la{' '}
              <Text style={styles.link}>Politique de confidentialité</Text>
            </>
          }
        />
                <AppButton title="Créer mon compte" onPress={() => router.push('/(onboarding)/genres')} />
                <AuthFooter
                    question="Déjà inscrit ?"
                    actionText="Se connecter"
                    onPress={() => router.push('/sign_in')}
                />
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
    link: {
        color: colors.primary,
        fontWeight: '600',
    },
});