import React, { useState } from 'react'
import { Container, Content } from '~/components/BaseScreen'
import Button from '~/components/Button'
import TextField from '~/components/TextField'
import { View, StyleSheet, TouchableOpacity, Platform, ScrollView, Image } from 'react-native'
import { TextTitle } from '~/components/Typography/TextTitle'
import { NormalText } from '~/components/Typography/NormalText'
import { Camera, X, Image as ImageIcon, ArrowLeft, Plus } from 'phosphor-react-native'
import { useNavigation } from '@react-navigation/native'

import Colors from '~/theme/colors'
import { useMutation } from '@tanstack/react-query'
import { CreateRankingItem } from '~/api/resources/core/create-ranking-item'
import { QuerieKeys } from '~/api/resources/querie-keys'
import { toast } from 'sonner-native'
import { hapticFeedback, HapticsType } from '~/utils/feedback'
import navigationService from '~/services/navigation.service'
import { queryClient } from '~/lib/react-query'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import ImagePicker from '~/components/ImagePicker'
import * as ExpoImagePicker from 'expo-image-picker'
import { UploadFile } from '~/api/resources/core/upload-file'
import { UploadFileResponse } from '~/api/resources/core/upload-file'

interface CreateRankingItemScreenProps {
    route: {
        params: {
            rankingId: string
        }
    }
}

interface ItemImage {
    uri: string
    uploaded?: UploadFileResponse
    loading?: boolean
}

export default function CreateRankingItemScreen({ route }: CreateRankingItemScreenProps) {
    const { rankingId } = route.params
    const navigation = useNavigation()
    const [itemName, setItemName] = useState<string>('')
    const [images, setImages] = useState<ItemImage[]>([])
    const insets = useSafeAreaInsets()

    const {
        mutateAsync: CreateRankingItemFn,
        isPending: isCreatingItemLoading,
    } = useMutation({
        mutationFn: CreateRankingItem,
        mutationKey: [QuerieKeys.CreateRankingItem],
        networkMode: 'online',
        onSuccess: () => {
            hapticFeedback(HapticsType.SUCCESS)
            toast.success('Item criado com sucesso!')

            // Invalidate the GetRankingItems query to refresh the list
            queryClient.invalidateQueries({
                queryKey: [QuerieKeys.GetRankingItems, rankingId],
            })

            navigationService.goBack()
        },
        onError: (error) => {
            hapticFeedback(HapticsType.ERROR)
            toast.error('Erro ao criar item')
            console.error('Error creating ranking item:', error)
        },
    })

    const {
        mutateAsync: UploadFileFn,
        isPending: isUploadingFileLoading,
    } = useMutation({
        mutationFn: UploadFile,
        mutationKey: [QuerieKeys.UploadFile],
        networkMode: 'online',
        onSuccess: () => {
            hapticFeedback(HapticsType.SUCCESS)
        },
    })

    async function openImagePicker() {
        let result = await ExpoImagePicker.launchImageLibraryAsync({
            mediaTypes: ExpoImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            aspect: [4, 3],
            quality: 1,
        });

        if (!result.canceled && result.assets && result.assets[0]) {
            const newImage: ItemImage = {
                uri: result.assets[0].uri,
                loading: true
            }

            setImages(prev => [...prev, newImage])

            const formData = new FormData();
            formData.append('attachment', {
                uri: result.assets[0].uri,
                name: result.assets[0].fileName || 'image.jpg',
                type: result.assets[0].type || 'image/jpeg',
            } as any);

            try {
                const imageuploaded = await UploadFileFn(formData)
                setImages(prev => prev.map(img =>
                    img.uri === newImage.uri
                        ? { ...img, uploaded: imageuploaded, loading: false }
                        : img
                ))
            } catch (error) {
                setImages(prev => prev.filter(img => img.uri !== newImage.uri))
                toast.error('Erro ao fazer upload da imagem')
            }
        }

        hapticFeedback(HapticsType.SUCCESS)
    }

    function removeImage(imageUri: string) {
        setImages(prev => prev.filter(img => img.uri !== imageUri))
        hapticFeedback(HapticsType.SUCCESS)
    }

    async function handleCreateRankingItem() {
        if (!itemName.trim()) {
            toast.error('Digite o nome do item')
            return
        }

        // Verificar se todas as imagens foram carregadas
        const hasUnloadedImages = images.some(img => img.loading)
        if (hasUnloadedImages) {
            toast.error('Aguarde o carregamento das imagens')
            return
        }

        try {
            await CreateRankingItemFn({
                name: itemName.trim(),
                rankingId,
                imageIds: images.map(img => img.uploaded?.id).filter(Boolean) as string[],
            })
        } catch (error) {
            console.error('Error in handleCreateRankingItem:', error)
        }
    }

    return (
        <Container>
            <ScrollView
                style={styles.scrollView}
                contentContainerStyle={styles.scrollContent}
                showsVerticalScrollIndicator={false}
            >
                <View style={styles.content}>
                    <View style={styles.inputSection}>
                        <TextField
                            label="Nome do Item"
                            placeholder="Digite o nome do item"
                            value={itemName}
                            onChangeText={setItemName}
                            hasError={false}
                            maxLength={100}
                        />
                    </View>

                    <View style={styles.photoSection}>
                        <NormalText style={styles.photoLabel}>
                            Fotos do item (opcional)
                        </NormalText>

                        <View style={styles.imagesContainer}>
                            {images.map((image, index) => (
                                <View key={image.uri} style={styles.imageItem}>
                                    <Image
                                        source={{ uri: image.uri }}
                                        style={styles.imagePreview}
                                        resizeMode="cover"
                                    />
                                    {image.loading && (
                                        <View style={styles.loadingOverlay}>
                                            <NormalText style={styles.loadingText}>
                                                Carregando...
                                            </NormalText>
                                        </View>
                                    )}
                                    <TouchableOpacity
                                        style={styles.removeImageButton}
                                        onPress={() => removeImage(image.uri)}
                                    >
                                        <X size={16} color={Colors.white} weight="bold" />
                                    </TouchableOpacity>
                                </View>
                            ))}

                            <TouchableOpacity
                                onPress={openImagePicker}
                                style={styles.addImageButton}
                                activeOpacity={0.8}
                            >
                                <Plus size={32} color={Colors.darkTint} weight="bold" />
                                <NormalText style={styles.addImageText}>
                                    Adicionar foto
                                </NormalText>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </ScrollView>

            <View style={styles.fixedButton}>
                <Button
                    title={isCreatingItemLoading ? 'Criando...' : 'Criar Item'}
                    onPress={handleCreateRankingItem}
                    loading={isCreatingItemLoading}
                    variant='filled'
                />
            </View>
        </Container>
    )
}

const styles = StyleSheet.create({
    scrollView: {
        flex: 1,
    },
    scrollContent: {
        paddingHorizontal: 20,
        paddingTop: 20,
        paddingBottom: 120,
    },
    content: {
        flex: 1,
    },
    inputSection: {
        marginBottom: 32,
    },
    photoSection: {
        marginBottom: 40,
    },
    photoLabel: {
        fontSize: 16,
        fontWeight: '600',
        color: Colors.darkTint,
        marginBottom: 16,
    },
    imagesContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 12,
    },
    imageItem: {
        position: 'relative',
        width: 100,
        height: 100,
        borderRadius: 12,
        overflow: 'hidden',
    },
    imagePreview: {
        width: '100%',
        height: '100%',
    },
    loadingOverlay: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    loadingText: {
        color: Colors.white,
        fontSize: 12,
        fontWeight: '500',
    },
    removeImageButton: {
        position: 'absolute',
        top: 8,
        right: 8,
        backgroundColor: 'rgba(0, 0, 0, 0.6)',
        borderRadius: 16,
        width: 24,
        height: 24,
        justifyContent: 'center',
        alignItems: 'center',
    },
    addImageButton: {
        width: 100,
        height: 100,
        backgroundColor: Colors.white,
        borderRadius: 12,
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 2,
        borderColor: Colors.background,
        borderStyle: 'dashed',
    },
    addImageText: {
        marginTop: 4,
        fontSize: 12,
        color: Colors.darkTint,
        textAlign: 'center',
        fontWeight: '500',
    },
    fixedButton: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        backgroundColor: Colors.white,
        paddingHorizontal: 20,
        paddingVertical: 16,
        paddingBottom: Platform.OS === 'android' ? 32 : 16,
        borderTopWidth: 1,
        borderTopColor: Colors.background,
    },
}) 