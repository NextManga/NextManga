import { AuthFooter } from "@/components/auth/AuthFooter";
import { PasswordStrength } from "@/components/auth/PasswordStrength";
import { AppButton } from "@/components/ui/AppButton";
import { AppCheckbox } from "@/components/ui/AppCheckbox";
import { AppInput } from "@/components/ui/AppInput";
import { AppLogo } from "@/components/ui/AppLogo";
import { colors } from "@/constants/theme";
import { useSignUpForm } from "@/contexts/SignUpContext";
import { router } from "expo-router";
import { useState } from "react";
import { StyleSheet, Text, View } from "react-native";

export default function SignUpScreen() {
    const { formData, error, updateFormData } = useSignUpForm();
    const [accepted, setAccepted] = useState(false);
    const [confirmPassword, setConfirmPassword] = useState('');
    const [validationError, setValidationError] = useState<string | null>(null);

    const passwordLevel = formData.password.length === 0 ? 0 :
        formData.password.length < 6 ? 1 :
            formData.password.length < 10 ? 2 : 3;

    const handleNext = () => {
        // Validation
        if (!formData.displayName.trim()) {
            setValidationError("Le nom d'utilisateur est requis");
            return;
        }
        if (!formData.email.trim() || !formData.email.includes('@')) {
            setValidationError("Veuillez entrer une adresse email valide");
            return;
        }
        if (formData.password.length < 6) {
            setValidationError("Le mot de passe doit contenir au moins 6 caractères");
            return;
        }
        if (formData.password !== confirmPassword) {
            setValidationError("Les mots de passe ne correspondent pas");
            return;
        }
        if (!accepted) {
            setValidationError("Vous devez accepter les conditions d'utilisation");
            return;
        }

        setValidationError(null);
        router.push('/(onboarding)/genres');
    };

    return (
        <>
            <AppLogo />
            <View style={styles.card}>
                <Text style={styles.title}>Inscription</Text>
                <Text style={styles.subtitle}>Rejoignez la communauté !</Text>

                <AppInput
                    placeholder="Nom d'utilisateur"
                    onChangeText={(text) => updateFormData({ displayName: text })}
                    value={formData.displayName}
                />
                <AppInput
                    placeholder="Adresse email"
                    onChangeText={(text) => updateFormData({ email: text })}
                    value={formData.email}
                />

                <AppInput
                    placeholder="Mot de passe"
                    secureTextEntry
                    onChangeText={(text) => updateFormData({ password: text })}
                    value={formData.password}
                />
                <PasswordStrength level={passwordLevel} />

                <AppInput
                    placeholder="Confirmer le mot de passe"
                    secureTextEntry
                    onChangeText={setConfirmPassword}
                    value={confirmPassword}
                />

                {validationError && (
                    <Text style={styles.errorText}>{validationError}</Text>
                )}

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
                <AppButton title="Créer mon compte" onPress={handleNext} />
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
    errorText: {
        color: '#EF4444',
        fontSize: 14,
        marginBottom: 12,
        fontWeight: '500',
    },
});