import React, { useCallback, useState } from 'react';
import { View, StyleSheet, TextInput, Alert, KeyboardAvoidingView, Platform, Modal, TouchableWithoutFeedback } from 'react-native';
import { TouchableOpacity } from 'react-native';
import { X, UserPlus } from 'phosphor-react-native';
import Colors from '~/theme/colors';
import { NormalText } from '~/components/Typography/NormalText';
import { TextTitle } from '~/components/Typography/TextTitle';
import Button from '~/components/Button';

interface InviteUserActionSheetProps {
    visible: boolean;
    onClose: () => void;
    onInvite: (email: string) => Promise<void>;
    loading: boolean;
}

export default function InviteUserActionSheet({
    visible,
    onClose,
    onInvite,
    loading
}: InviteUserActionSheetProps) {
    const [email, setEmail] = useState('');
    const [error, setError] = useState('');

    const handleClose = useCallback(() => {
        setEmail('');
        setError('');
        onClose();
    }, [onClose]);

    const handleInvite = async () => {
        if (!email.trim()) {
            setError('Digite um email válido');
            return;
        }

        if (!email.includes('@')) {
            setError('Digite um email válido');
            return;
        }

        try {
            await onInvite(email.trim());
            handleClose();
        } catch (error) {
            // Error is handled by the parent component
        }
    };

    const styles = StyleSheet.create({
        modalOverlay: {
            flex: 1,
            backgroundColor: 'rgba(0, 0, 0, 0.5)',
            justifyContent: 'flex-end',
        },
        modalContent: {
            backgroundColor: Colors.white,
            borderTopLeftRadius: 20,
            borderTopRightRadius: 20,
            width: '100%',
            paddingTop: 20,
            paddingHorizontal: 24,
            paddingBottom: 34,
        },
        handleIndicator: {
            backgroundColor: Colors.textHiglight,
            width: 40,
            height: 4,
            borderRadius: 2,
            alignSelf: 'center',
            marginBottom: 16,
        },
        content: {
            flex: 1,
        },
        header: {
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginBottom: 32,
        },
        title: {
            fontSize: 20,
            fontWeight: '700',
            color: Colors.darkTint,
        },
        closeButton: {
            padding: 4,
        },
        form: {
            flex: 1,
        },
        inputContainer: {
            marginBottom: 32,
        },
        label: {
            fontSize: 16,
            fontWeight: '600',
            color: Colors.darkTint,
            marginBottom: 8,
        },
        input: {
            borderWidth: 1,
            borderColor: Colors.background,
            borderRadius: 12,
            paddingHorizontal: 16,
            paddingVertical: 12,
            fontSize: 16,
            color: Colors.darkTint,
            backgroundColor: Colors.background,
        },
        errorText: {
            color: '#ef4444',
            fontSize: 14,
            marginTop: 4,
        },
        keyboardAvoidingView: {
            flex: 1,
        },
    });

    return (
        <Modal
            visible={visible}
            transparent={true}
            animationType="slide"
            onRequestClose={handleClose}
        >
            <TouchableWithoutFeedback onPress={handleClose}>
                <View style={styles.modalOverlay}>
                    <TouchableWithoutFeedback onPress={() => { }}>
                        <View style={styles.modalContent}>
                            <View style={styles.handleIndicator} />
                            <KeyboardAvoidingView
                                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                                style={styles.keyboardAvoidingView}
                            >
                                <View style={styles.header}>
                                    <TextTitle style={styles.title}>
                                        Convidar usuário
                                    </TextTitle>
                                    <TouchableOpacity onPress={handleClose} style={styles.closeButton}>
                                        <X size={24} color={Colors.darkTint} weight="bold" />
                                    </TouchableOpacity>
                                </View>

                                <View style={styles.form}>
                                    <View style={styles.inputContainer}>
                                        <NormalText style={styles.label}>
                                            Email do usuário
                                        </NormalText>
                                        <TextInput
                                            style={styles.input}
                                            placeholder=""
                                            value={email}
                                            onChangeText={(text) => {
                                                setEmail(text);
                                                setError('');
                                            }}
                                            keyboardType="email-address"
                                            autoCapitalize="none"
                                            autoCorrect={false}
                                            placeholderTextColor={Colors.textHiglight}
                                            autoFocus
                                        />
                                        {error ? (
                                            <NormalText style={styles.errorText}>
                                                {error}
                                            </NormalText>
                                        ) : null}
                                    </View>

                                    <Button
                                        title="Enviar convite"
                                        onPress={handleInvite}
                                        loading={loading}
                                        variant='filled'
                                        iconLeft={<UserPlus size={20} color={Colors.darkTint} weight="bold" />}
                                    />
                                </View>
                            </KeyboardAvoidingView>
                        </View>
                    </TouchableWithoutFeedback>
                </View>
            </TouchableWithoutFeedback>
        </Modal>
    );
} 