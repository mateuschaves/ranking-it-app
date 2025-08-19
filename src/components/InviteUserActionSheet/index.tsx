import React, { useCallback, useMemo, useRef, useState } from 'react';
import { View, StyleSheet, TextInput, Alert } from 'react-native';
import { BottomSheetModal, BottomSheetView } from '@gorhom/bottom-sheet';
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

    const bottomSheetModalRef = useRef<BottomSheetModal>(null);
    const snapPoints = useMemo(() => ['50%'], []);

    React.useEffect(() => {
        if (visible) {
            bottomSheetModalRef.current?.present();
        } else {
            bottomSheetModalRef.current?.dismiss();
        }
    }, [visible]);

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
        backdrop: {
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(0, 0, 0, 0.5)',
        },
        bottomSheetBackground: {
            backgroundColor: Colors.white,
            borderTopLeftRadius: 20,
            borderTopRightRadius: 20,
        },
        handleIndicator: {
            backgroundColor: Colors.textHiglight,
            width: 40,
            height: 4,
        },
        content: {
            flex: 1,
            padding: 24,
        },
        header: {
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginBottom: 24,
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
            marginBottom: 24,
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
    });

    return (
        <BottomSheetModal
            ref={bottomSheetModalRef}
            index={0}
            snapPoints={snapPoints}
            onDismiss={handleClose}
            backgroundStyle={styles.bottomSheetBackground}
            handleIndicatorStyle={styles.handleIndicator}
            backdropComponent={() => (
                <View style={styles.backdrop} />
            )}
        >
            <BottomSheetView style={styles.content}>
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
            </BottomSheetView>
        </BottomSheetModal>
    );
} 