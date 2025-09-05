import React, { useEffect, useState } from 'react'
import { View, StyleSheet, ScrollView, TouchableOpacity, Image } from 'react-native'
import { useMutation, useQuery } from '@tanstack/react-query'
import { RouteProp, useRoute } from '@react-navigation/native'
import { RootStackParamList } from '~/navigation/navigation.type'
import { NormalText } from '~/components/Typography/NormalText'
import { TextTitle } from '~/components/Typography/TextTitle'
import TextField from '~/components/TextField'
import Button from '~/components/Button'
import Colors from '~/theme/colors'
import { UploadFile, UploadFileResponse } from '~/api/resources/core/upload-file'
import * as ExpoImagePicker from 'expo-image-picker'
import { UpdateRankingItem } from '~/api/resources/core/update-ranking-item'
import { QuerieKeys } from '~/api/resources/querie-keys'
import { queryClient } from '~/lib/react-query'
import { hapticFeedback, HapticsType, showToast } from '~/utils/feedback'
import { GetRankingItems, GetRankingItemsResponse } from '~/api/resources/core/get-ranking-items'
import { X, Plus } from 'phosphor-react-native'
import navigationService from '~/services/navigation.service'

interface EditableImage {
    uri: string
    uploaded?: UploadFileResponse
    loading?: boolean
    error?: boolean
    existingId?: string
}

export default function EditRankingItemScreen() {
    const { params } = useRoute<RouteProp<RootStackParamList, 'EditRankingItemScreen'>>()
    const [name, setName] = useState<string>('')
    const [images, setImages] = useState<EditableImage[]>([])

    // Prefill with current item
    const { data: rankingItems } = useQuery({
        queryKey: [QuerieKeys.GetRankingItems, params.rankingId],
        queryFn: () => GetRankingItems({ id: params.rankingId }),
    })

    useEffect(() => {
        if (!rankingItems) return
        const current = (rankingItems as GetRankingItemsResponse[]).find(i => i.id === params.rankingItemId)
        if (!current) return

        setName(prev => prev?.length ? prev : (current.name || ''))

        if (images.length === 0 && current.rankingItemUserPhoto?.length) {
            const mapped: EditableImage[] = current.rankingItemUserPhoto
                .filter(p => !!p.photo?.uri)
                .map(p => ({ uri: p.photo.uri as string, existingId: p.photoId }))
            setImages(mapped)
        }
    }, [rankingItems])

    const { mutateAsync: uploadFileFn } = useMutation({
        mutationFn: UploadFile,
        mutationKey: [QuerieKeys.UploadFile],
    })

    const { mutateAsync: updateRankingItemFn, isPending } = useMutation({
        mutationFn: UpdateRankingItem,
        mutationKey: [QuerieKeys.UpdateRankingItem, params.rankingItemId],
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: [QuerieKeys.GetRankingItems, params.rankingId] })
            hapticFeedback(HapticsType.SUCCESS)
            showToast({ type: 'success', title: 'Item atualizado!' })
            navigationService.goBack()
        },
    })

    async function openImagePicker() {
        const permission = await ExpoImagePicker.requestMediaLibraryPermissionsAsync()
        if (!permission.granted) return

        const result = await ExpoImagePicker.launchImageLibraryAsync({
            mediaTypes: ExpoImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            aspect: [16, 9],
            quality: 0.8,
            base64: false,
            exif: false,
            allowsMultipleSelection: false,
            selectionLimit: 1,
        })

        if (!result.canceled && result.assets?.[0]) {
            const selected = result.assets[0]
            const pending: EditableImage = { uri: selected.uri, loading: true }
            setImages(prev => [...prev, pending])

            const formData = new FormData()
            formData.append('attachment', {
                uri: selected.uri,
                name: selected.fileName || 'image.jpg',
                type: selected.type || 'image/jpeg',
            } as any)

            try {
                const uploaded = await uploadFileFn(formData)
                setImages(prev => prev.map(img => img.uri === pending.uri ? ({ ...img, uploaded, loading: false }) : img))
            } catch (e) {
                setImages(prev => prev.filter(img => img.uri !== pending.uri))
            }
        }
    }

    function removeImage(uri: string) {
        setImages(prev => prev.filter(img => img.uri !== uri))
    }

    async function handleSave() {
        const photos = images
            .map(i => i.uploaded?.id || i.existingId)
            .filter((id): id is string => Boolean(id))
        await updateRankingItemFn({
            rankingId: params.rankingId,
            rankingItemId: params.rankingItemId,
            name: name.trim() || undefined,
            photos,
        })
    }

    return (
        <ScrollView contentContainerStyle={styles.container} showsVerticalScrollIndicator={false}>
            <View style={styles.section}>
                <TextTitle style={styles.title}>Editar Item</TextTitle>
                <TextField
                    label="Nome do Item"
                    placeholder="Atualize o nome"
                    value={name}
                    onChangeText={setName}
                />
            </View>

            <View style={styles.section}>
                <NormalText style={styles.subtitle}>Fotos</NormalText>
                <View style={styles.imagesContainer}>
                    {images.map(image => (
                        <View key={image.uri} style={styles.imageItem}>
                            {!image.error ? (
                                <Image
                                    source={{ uri: image.uri }}
                                    style={styles.imagePreview}
                                    resizeMode="cover"
                                    onError={() => {
                                        setImages(prev => prev.map(img =>
                                            img.uri === image.uri
                                                ? { ...img, error: true }
                                                : img
                                        ))
                                    }}
                                />
                            ) : (
                                <View style={styles.imageErrorContainer}>
                                    <NormalText style={styles.removeLabel}>Erro ao carregar</NormalText>
                                </View>
                            )}
                            {image.loading && (
                                <View style={styles.loadingOverlay}>
                                    <NormalText style={styles.loadingText}>Carregando...</NormalText>
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

                    <TouchableOpacity onPress={openImagePicker} style={styles.addImageButton} activeOpacity={0.8}>
                        <Plus size={32} color={Colors.darkTint} weight="bold" />
                        <NormalText style={styles.addImageText}>Adicionar foto</NormalText>
                    </TouchableOpacity>
                </View>
            </View>

            <Button title={isPending ? 'Salvando...' : 'Salvar'} onPress={handleSave} loading={isPending} />
        </ScrollView>
    )
}

const styles = StyleSheet.create({
    container: {
        padding: 16,
        gap: 24,
    },
    section: {
        gap: 12,
    },
    title: {
        fontSize: 20,
    },
    subtitle: {
        fontSize: 14,
        marginBottom: 8,
    },
    imagesContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 12,
    },
    imageItem: {
        position: 'relative',
        width: 120,
        height: 80,
        borderRadius: 12,
        overflow: 'hidden',
    },
    imagePreview: {
        width: '100%',
        height: '100%',
    },
    imageErrorContainer: {
        width: '100%',
        height: '100%',
        backgroundColor: Colors.background,
        justifyContent: 'center',
        alignItems: 'center',
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
    removeLabel: {
        color: Colors.white,
        fontSize: 10,
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
})


