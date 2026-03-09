import { AuthFooter } from "@/components/auth/AuthFooter";
import { PasswordStrength } from "@/components/auth/PasswordStrength";
import { AppButton } from "@/components/ui/AppButton";
import { AppCheckbox } from "@/components/ui/AppCheckbox";
import { AppInput } from "@/components/ui/AppInput";
import { AppLogo } from "@/components/ui/AppLogo";
import { useSignUpForm } from "@/contexts/SignUpContext";
import { useThemeColors } from "@/hooks/useThemeColors";
import { router } from "expo-router";
import { useState } from "react";
import { Trans, useTranslation } from "react-i18next";
import { StyleSheet, Text, View } from "react-native";

export default function SignUpScreen() {
    const { formData, error, updateFormData } = useSignUpForm();
    const colors = useThemeColors();
    const { t } = useTranslation();
    const [accepted, setAccepted] = useState(false);
    const [confirmPassword, setConfirmPassword] = useState('');
    const [validationError, setValidationError] = useState<string | null>(null);

    const passwordLevel = formData.password.length === 0 ? 0 :
        formData.password.length < 6 ? 1 :
            formData.password.length < 10 ? 2 : 3;

    const handleNext = () => {
        // Validation
        if (!formData.displayName.trim()) {
            setValidationError(t('ui.auth.signUp.displayNameRequired'));
            return;
        }
        
        // Email validation avec regex plus stricte
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!formData.email.trim() || !emailRegex.test(formData.email.trim())) {
            setValidationError(t('ui.auth.signUp.invalidEmail'));
            return;
        }
        
        if (formData.password.length < 6) {
            setValidationError(t('ui.auth.signUp.passwordMin'));
            return;
        }
        if (formData.password !== confirmPassword) {
            setValidationError(t('ui.auth.signUp.passwordMismatch'));
            return;
        }
        if (!accepted) {
            setValidationError(t('ui.auth.signUp.mustAcceptTerms'));
            return;
        }

        setValidationError(null);
        console.log('✅ Données d\'inscription validées et sauvegardées:', {
            displayName: formData.displayName,
            email: formData.email,
            password: '***'
        });
        router.push('/(onboarding)/genres');
    };

    return (
        <>
            <AppLogo />
            <View style={[styles.card, { backgroundColor: colors.surfacePrimary }]}>
                <Text style={[styles.title, { color: colors.textPrimary }]}>{t('ui.auth.signUp.title')}</Text>
                <Text style={[styles.subtitle, { color: colors.textSecondary }]}>{t('ui.auth.signUp.subtitle')}</Text>

                <AppInput
                    placeholder={t('ui.auth.signUp.displayNamePlaceholder')}
                    onChangeText={(text) => updateFormData({ displayName: text })}
                    value={formData.displayName}
                />
                <AppInput
                    placeholder={t('ui.auth.signUp.emailPlaceholder')}
                    onChangeText={(text) => updateFormData({ email: text })}
                    value={formData.email}
                />

                <AppInput
                    placeholder={t('ui.auth.signUp.passwordPlaceholder')}
                    secureTextEntry
                    onChangeText={(text) => updateFormData({ password: text })}
                    value={formData.password}
                />
                <PasswordStrength level={passwordLevel} />

                <AppInput
                    placeholder={t('ui.auth.signUp.confirmPasswordPlaceholder')}
                    secureTextEntry
                    onChangeText={setConfirmPassword}
                    value={confirmPassword}
                />

                {validationError && (
                    <Text style={[styles.errorText, { color: colors.error }]}>{validationError}</Text>
                )}

                <AppCheckbox
                    checked={accepted}
                    onToggle={() => setAccepted(!accepted)}
                    label={
                        <Text style={{ color: colors.textSecondary }}>
                            <Trans
                                i18nKey="ui.auth.signUp.acceptTerms"
                                components={{
                                    terms: <Text style={[styles.link, { color: colors.primary }]} />,
                                    privacy: <Text style={[styles.link, { color: colors.primary }]} />,
                                }}
                            />
                        </Text>
                    }
                />
                <AppButton title={t('ui.auth.signUp.submit')} onPress={handleNext} />
                <AuthFooter
                    question={t('ui.auth.signUp.haveAccount')}
                    actionText={t('ui.auth.signUp.signInAction')}
                    onPress={() => router.push('/sign_in')}
                />
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
    link: {
        fontWeight: '600',
    },
    errorText: {
        fontSize: 14,
        marginBottom: 12,
        fontWeight: '500',
    },
});