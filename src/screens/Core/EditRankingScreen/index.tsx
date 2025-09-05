import React, { useState } from 'react'
import { View, StyleSheet, Image, TouchableOpacity, ScrollView } from 'react-native'
import { RouteProp, useRoute } from '@react-navigation/native'
import { RootStackParamList } from '~/navigation/navigation.type'
import { useMutation } from '@tanstack/react-query'
import * as ExpoImagePicker from 'expo-image-picker'
import { UploadFile, UploadFileResponse } from '~/api/resources/core/upload-file'
import { UpdateRanking } from '~/api/resources/core/update-ranking'
import { QuerieKeys } from '~/api/resources/querie-keys'
import { queryClient } from '~/lib/react-query'
import Colors from '~/theme/colors'
import { NormalText } from '~/components/Typography/NormalText'
import Button from '~/components/Button'
import { hapticFeedback, HapticsType, showToast } from '~/utils/feedback'

export default function EditRankingScreen() {
  const { params } = useRoute<RouteProp<RootStackParamList, 'EditRankingScreen'>>()
  const [banner, setBanner] = useState<UploadFileResponse | null>(null)

  const { mutateAsync: uploadFileFn } = useMutation({
    mutationFn: UploadFile,
    mutationKey: [QuerieKeys.UploadFile],
  })

  const { mutateAsync: updateRankingFn, isPending } = useMutation({
    mutationFn: UpdateRanking,
    mutationKey: [QuerieKeys.UpdateRanking, params.rankingId],
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QuerieKeys.GetRankingsByUser] })
      hapticFeedback(HapticsType.SUCCESS)
      showToast({ type: 'success', title: 'Ranking atualizado!' })
    },
  })

  async function pickBanner() {
    const permission = await ExpoImagePicker.requestMediaLibraryPermissionsAsync()
    if (!permission.granted) return

    const res = await ExpoImagePicker.launchImageLibraryAsync({
      mediaTypes: ExpoImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [16, 9],
      quality: 0.85,
      selectionLimit: 1,
    })
    if (res.canceled || !res.assets?.[0]) return

    const asset = res.assets[0]
    const form = new FormData()
    form.append('attachment', {
      uri: asset.uri,
      name: asset.fileName || 'banner.jpg',
      type: asset.type || 'image/jpeg',
    } as any)

    const file = await uploadFileFn(form)
    setBanner(file)
  }

  async function handleSave() {
    if (!banner?.id) return
    await updateRankingFn({ bannerId: banner.id, rankingId: params.rankingId })
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <NormalText style={styles.label}>Banner do ranking</NormalText>
      <View style={styles.bannerBox}>
        {banner?.path ? (
          <Image source={{ uri: banner.path }} style={styles.banner} />
        ) : (
          <NormalText style={styles.placeholder}>Selecione um banner</NormalText>
        )}
      </View>
      <TouchableOpacity style={styles.pick} onPress={pickBanner}>
        <NormalText style={styles.pickLabel}>Escolher imagem</NormalText>
      </TouchableOpacity>

      <Button title={isPending ? 'Salvando...' : 'Salvar'} onPress={handleSave} loading={isPending} />
    </ScrollView>
  )
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
    gap: 16,
  },
  label: {
    fontSize: 14,
  },
  bannerBox: {
    height: 180,
    borderRadius: 12,
    backgroundColor: Colors.background,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  banner: {
    width: '100%',
    height: '100%',
  },
  placeholder: {
    color: Colors.textHiglight,
  },
  pick: {
    alignSelf: 'flex-start',
    borderWidth: 1,
    borderColor: Colors.background,
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 8,
    backgroundColor: Colors.white,
  },
  pickLabel: {
    color: Colors.darkTint,
    fontWeight: '600',
  },
})


