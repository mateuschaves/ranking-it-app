import React, { useState } from 'react'
import { Container } from '~/components/BaseScreen'
import Button from '~/components/Button'
import TextField from '~/components/TextField'
import { TextTitle } from '~/components/Typography/TextTitle'
import { PaperPlaneRight, Trophy } from 'phosphor-react-native'

import { ProgressSteps, ProgressStep } from 'react-native-progress-steps';

import theme from '~/theme'
import Colors from '~/theme/colors'
import { useMutation } from '@tanstack/react-query'
import { CreateRanking, CreateRankingResponse } from '~/api/resources/core/create-ranking'
import { QuerieKeys } from '~/api/resources/querie-keys'
import { toast } from 'sonner-native'
import { View } from 'react-native'
import ImagePicker from '~/components/ImagePicker'
import * as ExpoImagePicker from 'expo-image-picker'
import {hapticFeedback, HapticsType} from '~/utils/feedback'
import { UploadFile } from '~/api/resources/core/upload-file'
import { UpdateRanking } from '~/api/resources/core/update-ranking'
import { UploadFileResponse } from '../../../api/resources/core/upload-file';

export default function CreateRankingScreen() {
  const [rankingName, setRankingName] = useState<string>('')
  const [rankingDescription, setRankingDescription] = useState<string>('')
  const [image, setImage] = useState<string | null>(null)
  const [loadingImage, setLoadingImage] = useState<boolean>(false)
  const [formStep, setFormStep] = useState<number>(0)
  const [rankingCreated, setRankingCreated] = useState<CreateRankingResponse>()
  const [imageUploaded, setImageUploaded] = useState<UploadFileResponse>()

  const {
    mutateAsync: CreateRankingFn,
    isPending: isCreatingRankingLoading,
  } = useMutation({
    mutationFn: CreateRanking,
    mutationKey: [QuerieKeys.CreateRanking],
    networkMode: 'online',
    onSuccess: () => {
      hapticFeedback(HapticsType.SUCCESS)
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

  const {
    mutateAsync: UpdateRankingFn,
    isPending: isUpdatingRankingLoading,
  } = useMutation({
    mutationFn: UpdateRanking,
    mutationKey: [QuerieKeys.UpdateRanking],
    networkMode: 'online',
    onSuccess: () => {
      hapticFeedback(HapticsType.SUCCESS)
    },
  })

  async function openImagePicker() {
    setLoadingImage(true)
    let result = await ExpoImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled) {
      setImage(result.assets[0].uri);
    }

    if (result.assets && result.assets[0]) {
      const formData = new FormData();
      formData.append('attachment', {
        uri: result.assets[0].uri,
        name: result.assets[0].fileName || 'image.jpg',
        type: result.assets[0].type || 'image/jpeg',
      });

      const imageuploaded = await UploadFileFn(formData);

      setImageUploaded(imageuploaded)
    }


    setLoadingImage(false)
    hapticFeedback(HapticsType.SUCCESS)
  }

  async function handleCreateRanking() {
    if (!rankingName || !rankingDescription) {
      toast.error('Preencha todos os campos')
      return
    }

    const ranking = await CreateRankingFn({
      name: rankingName,
      description: rankingDescription,
    });

    setRankingCreated(ranking)

    setFormStep(previousStep => previousStep + 1)
  }

  async function handleUpdateRanking() {
    if (!imageUploaded) {
      toast.error('Selecione uma imagem')
      return
    }

    if (!rankingCreated) {
      toast.error('Crie um ranking primeiro')
      return
    }

    await UpdateRankingFn({
      bannerId: imageUploaded?.id,
      rankingId: rankingCreated.id,
    });

    setFormStep(previousStep => previousStep + 1)
  }
  
  return (
    <Container>
        <ProgressSteps 
            activeStep={formStep} 
            progressBarColor={Colors.darkTint} 
            disabledStepNumColor={Colors.white} 
            disabledStepIconColor={Colors.darkTint}
            labelColor={Colors.textHiglight}
            topOffset={theme.padding.md}
            labelFontSize={theme.text.md}
            borderWidth={0.5}
          >
          <ProgressStep label="Ranking" removeBtnRow>
                <TextTitle fontWeight={theme.weights.lg}>Crie seu ranking</TextTitle>
                <TextField placeholder="Ex. Top 10 músicas" value={rankingName} onChangeText={setRankingName} hasError={false} label='Título' />
                <TextField placeholder="Ex. Músicas preferidas do momento" value={rankingDescription} onChangeText={setRankingDescription} hasError={false} label='Descrição' />
                <Button title='Criar ranking' iconLeft={<Trophy color={Colors.white} />} onPress={handleCreateRanking} loading={isCreatingRankingLoading}/>
          </ProgressStep>
          <ProgressStep label="Foto de capa" removeBtnRow>
            <View>
                <ImagePicker onPress={openImagePicker} image={image} loading={loadingImage || isUploadingFileLoading} />
                <Button
                    title='Continuar'
                    iconLeft={<PaperPlaneRight color={Colors.white} />}
                    onPress={handleUpdateRanking}
                />
            </View>
          </ProgressStep>
          <ProgressStep label="Critérios" removeBtnRow>
              <View style={{ alignItems: 'center' }}>
                  <TextTitle>Critérios do ranking</TextTitle>
              </View>
          </ProgressStep>
        </ProgressSteps>
    </Container>
  )
}