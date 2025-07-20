import React, { useState, useLayoutEffect } from 'react';
import { View, StyleSheet, Alert, TouchableOpacity, Image } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Container } from '~/components/BaseScreen';
import { TextTitle } from '~/components/Typography/TextTitle';
import * as ExpoImagePicker from 'expo-image-picker';
import Button from '~/components/Button';
import Colors from '~/theme/colors';
import { Camera, X } from 'phosphor-react-native';

export default function ProfilePhotoScreen() {
    const [image, setImage] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);
    const navigation = useNavigation();

    useLayoutEffect(() => {
        navigation.setOptions({
            headerRight: () => (
                <TouchableOpacity onPress={() => navigation.goBack()} style={{ marginRight: 12 }}>
                    <X size={28} color={Colors.darkTint} weight="bold" />
                </TouchableOpacity>
            ),
            headerShown: true,
            headerTitle: '',
            headerTransparent: true,
            headerLeft: () => null,
        });
    }, [navigation]);

    async function handlePickImage() {
        setLoading(true);
        let result = await ExpoImagePicker.launchImageLibraryAsync({
            mediaTypes: ExpoImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            aspect: [1, 1],
            quality: 1,
        });
        if (!result.canceled && result.assets && result.assets[0]) {
            setImage(result.assets[0].uri);
        }
        setLoading(false);
    }

    function handleSave() {
        Alert.alert('Foto de perfil', 'Salvar foto de perfil (implementar upload)');
    }

    return (
        <Container style={styles.container}>
            <TextTitle style={styles.title}>Escolha sua foto de perfil</TextTitle>
            <View style={styles.avatarContainer}>
                <View style={styles.avatarShadow}>
                    <TouchableOpacity style={styles.avatarButton} onPress={handlePickImage} activeOpacity={0.8}>
                        {image ? (
                            <View style={styles.avatarWrapper}>
                                <View style={styles.avatarBorder}>
                                    <View style={styles.avatarBg}>
                                        <Image
                                            source={{ uri: image }}
                                            style={{ width: 140, height: 140, borderRadius: 70 }}
                                        />
                                    </View>
                                </View>
                                <View style={styles.cameraButton}>
                                    <Camera size={28} color={Colors.white} weight="fill" />
                                </View>
                            </View>
                        ) : (
                            <View style={styles.avatarWrapper}>
                                <View style={styles.avatarBorder}>
                                    <View style={[styles.avatarBg, { justifyContent: 'center', alignItems: 'center' }]}>
                                        <Camera size={48} color={Colors.darkTint} weight="light" />
                                    </View>
                                </View>
                                <View style={styles.cameraButton}>
                                    <Camera size={28} color={Colors.white} weight="fill" />
                                </View>
                            </View>
                        )}
                    </TouchableOpacity>
                </View>
            </View>
            {image && (
                <View style={styles.saveButton}>
                    <Button title="Salvar" onPress={handleSave} />
                </View>
            )}
        </Container>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 24,
        backgroundColor: Colors.background,
        justifyContent: 'center',
        alignItems: 'center',
    },
    title: {
        marginBottom: 32,
        textAlign: 'center',
        fontSize: 24,
    },
    avatarContainer: {
        alignItems: 'center',
        marginBottom: 32,
        width: '100%',
    },
    avatarShadow: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.15,
        shadowRadius: 12,
        elevation: 8,
        borderRadius: 80,
        backgroundColor: 'transparent',
    },
    avatarButton: {
        alignItems: 'center',
        justifyContent: 'center',
    },
    avatarWrapper: {
        position: 'relative',
        width: 140,
        height: 140,
        alignItems: 'center',
        justifyContent: 'center',
    },
    avatarBorder: {
        width: 140,
        height: 140,
        borderRadius: 70,
        borderWidth: 3,
        borderColor: Colors.darkTint,
        overflow: 'hidden',
        backgroundColor: Colors.background,
    },
    avatarBg: {
        width: 134,
        height: 134,
        borderRadius: 67,
        backgroundColor: Colors.background,
        overflow: 'hidden',
    },
    cameraButton: {
        position: 'absolute',
        right: 0,
        bottom: 0,
        backgroundColor: Colors.darkTint,
        borderRadius: 20,
        padding: 6,
        borderWidth: 2,
        borderColor: Colors.background,
        elevation: 2,
    },
    saveButton: {
        marginTop: 32,
        width: '100%',
        paddingHorizontal: 24,
    },
}); 