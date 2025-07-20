import React, { useState } from 'react';
import { Modal, View, StyleSheet, TouchableOpacity } from 'react-native';
import TextField from '~/components/TextField';
import Button from '~/components/Button';
import { TextTitle } from '~/components/Typography/TextTitle';
import { NormalText } from '~/components/Typography/NormalText';
import theme from '~/theme';

interface InviteUserModalProps {
    visible: boolean;
    onClose: () => void;
    onInvite: (email: string) => void;
    loading?: boolean;
}

export default function InviteUserModal({ visible, onClose, onInvite, loading }: InviteUserModalProps) {
    const [email, setEmail] = useState('');
    const [error, setError] = useState('');

    function handleInvite() {
        if (!email.trim() || !email.includes('@')) {
            setError('Digite um email válido');
            return;
        }
        setError('');
        onInvite(email.trim());
    }

    function handleClose() {
        setEmail('');
        setError('');
        onClose();
    }

    return (
        <Modal
            visible={visible}
            animationType="slide"
            transparent
            onRequestClose={handleClose}
        >
            <View style={styles.overlay}>
                <View style={styles.modal}>
                    <TextTitle fontWeight={theme.weights.lg} style={styles.title}>
                        Convidar usuário
                    </TextTitle>
                    <NormalText style={styles.label}>Email do usuário</NormalText>
                    <TextField
                        placeholder="Digite o email"
                        value={email}
                        onChangeText={setEmail}
                        hasError={!!error}
                        keyboardType="email-address"
                        autoCapitalize="none"
                        autoCorrect={false}
                        style={styles.input}
                    />
                    {!!error && <NormalText style={styles.error}>{error}</NormalText>}
                    <Button
                        title={loading ? 'Enviando...' : 'Enviar convite'}
                        onPress={handleInvite}
                        loading={loading}
                        style={styles.button}
                    />
                    <TouchableOpacity onPress={handleClose} style={styles.closeButton}>
                        <NormalText style={styles.closeText}>Cancelar</NormalText>
                    </TouchableOpacity>
                </View>
            </View>
        </Modal>
    );
}

const styles = StyleSheet.create({
    overlay: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.3)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    modal: {
        width: '85%',
        backgroundColor: '#fff',
        borderRadius: 16,
        padding: 24,
        alignItems: 'stretch',
    },
    title: {
        marginBottom: 16,
        textAlign: 'center',
    },
    label: {
        marginBottom: 8,
    },
    input: {
        marginBottom: 8,
    },
    error: {
        color: 'red',
        marginBottom: 8,
    },
    button: {
        marginTop: 8,
    },
    closeButton: {
        marginTop: 16,
        alignItems: 'center',
    },
    closeText: {
        color: theme.colors.darkTint,
        fontWeight: 'bold',
    },
}); 