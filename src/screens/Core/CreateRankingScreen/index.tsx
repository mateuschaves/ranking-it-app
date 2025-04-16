import React, { useState } from 'react'
import { Container } from '~/components/BaseScreen'
import Button from '~/components/Button'
import TextField from '~/components/TextField'
import { TextTitle } from '~/components/Typography/TextTitle'
import { PaperPlaneRight, Trophy, Check } from 'phosphor-react-native'

import { ProgressSteps, ProgressStep } from 'react-native-progress-steps';

import theme from '~/theme'
import Colors from '~/theme/colors'
import { useMutation } from '@tanstack/react-query'
import { CreateRanking, CreateRankingResponse } from '~/api/resources/core/create-ranking'
import { QuerieKeys } from '~/api/resources/querie-keys'
import { toast } from 'sonner-native'
import { View, StyleSheet, ActivityIndicator } from 'react-native'
import ImagePicker from '~/components/ImagePicker'
import * as ExpoImagePicker from 'expo-image-picker'
import { hapticFeedback, HapticsType } from '~/utils/feedback'
import { UploadFile } from '~/api/resources/core/upload-file'
import { UpdateRanking } from '~/api/resources/core/update-ranking'
import { UploadFileResponse } from '~/api/resources/core/upload-file';
import { GetRankingCriteriaSuggest } from '~/api/resources/core/get-ranking-criteria-suggest'
import RankingCriteriaSuggest from '~/components/RankingCriteriaSuggest'
import { CreateRankingCriteria } from '~/api/resources/core/create-ranking-criteria'
import { RemoveRankingCriteria } from '~/api/resources/core/remove-ranking-criteria'
import NewRankingCriteriaSuggest from '~/components/NewRankingCriteriaSuggest'

import Modal from 'react-native-modal'
import Show from '~/components/Standart/Show'
import navigationService from '~/services/navigation.service'

interface RankingCriteria {
  id: string, 
  name: string, 
  loading: boolean 
}

export default function CreateRankingScreen() {
  const [rankingName, setRankingName] = useState<string>('')
  const [rankingDescription, setRankingDescription] = useState<string>('')
  const [image, setImage] = useState<string | null>(null)
  const [loadingImage, setLoadingImage] = useState<boolean>(false)
  const [formStep, setFormStep] = useState<number>(0)
  const [rankingCreated, setRankingCreated] = useState<CreateRankingResponse>()
  const [imageUploaded, setImageUploaded] = useState<UploadFileResponse>()
  const [suggestedRankingCriteria, setSuggestedRankingCriteria] = useState<RankingCriteria[]>([])
  const [selectedRankingCriteria, setSelectedRankingCriteria] = useState<RankingCriteria[]>([])
  const [isModalVisible, setIsModalVisible] = useState(false)
  const [rankingCriteriaName, setRankingCriteriaName] = useState<string>('')

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

  const {
    mutateAsync: GetRankingCriteriaSuggestFn,
    isPending: isGetRankingCriteriaSuggestLoading,
  } = useMutation({
    mutationFn: GetRankingCriteriaSuggest,
    mutationKey: [QuerieKeys.GetRankingCriteriaSuggest],
    networkMode: 'online',
    onSuccess: () => {
      hapticFeedback(HapticsType.SUCCESS)
    },
  })

  const {
    mutateAsync: CreateRankingCriteriaFn,
    isPending: isCreatingRankingCriteriaLoading,
  } = useMutation({
    mutationFn: CreateRankingCriteria,
    mutationKey: [QuerieKeys.CreateRankingCriteria],
    networkMode: 'online',
    onSuccess: () => {
      hapticFeedback(HapticsType.SUCCESS)
    },
  })

  const {
    mutateAsync: RemoveRankingCriteriaFn,
  } = useMutation({
    mutationFn: RemoveRankingCriteria,
    mutationKey: [QuerieKeys.RemoveRankingCriteria],
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
    if (!rankingCreated) {
      toast.error('Crie um ranking primeiro')
      return
    }
    GetRankingCriteriaSuggestFn({
      id: rankingCreated.id,
    }).then((response) => {
      console.log(
        response.criteria.map((item, index) =>
        ({
          id: index.toString(),
          name: item,
          loading: false,
        })
        )
      )
      setSuggestedRankingCriteria(response.criteria.map((item, index) =>
      ({
        id: index.toString(),
        name: item,
        loading: false,
      })
      ))
    });

    if (!imageUploaded) {
      setFormStep(previousStep => previousStep + 1)
      return
    }

    await UpdateRankingFn({
      bannerId: imageUploaded?.id,
      rankingId: rankingCreated.id,
    });
    setFormStep(previousStep => previousStep + 1)
  }

  async function handleCreateRankingCriteria(criteria: string) {
    if (!rankingCreated) {
      toast.error('Crie um ranking primeiro')
      return
    }

    setSuggestedRankingCriteria(
      previousState => previousState.map(item => {
        if (item.name === criteria) {
          return {
            ...item,
            loading: true,
          }
        }
        return item
      })
    )

    const criteriaCreated = await CreateRankingCriteriaFn({
      rankingId: rankingCreated.id,
      criteria,
    });


    setSelectedRankingCriteria([...selectedRankingCriteria, {
      id: criteriaCreated.id,
      name: criteria,
      loading: false,
    }])

    setSuggestedRankingCriteria(
      previousState => previousState.map(item => {
        if (item.name === criteria) {
          return {
            ...item,
            loading: false,
          }
        }
        return item
      })
    )

    toast.success('Critérios adicionado com sucesso')
  }

  async function handleRemoveRankingCriteria(criteriaName: string) {
    if (!rankingCreated) {
      toast.error('Crie um ranking primeiro')
      return
    }

    setSuggestedRankingCriteria(
      previousState => previousState.map(item => {
        if (item.name === criteriaName) {
          return {
            ...item,
            loading: true,
          }
        }
        return item
      })
    )

    const criteriaId = selectedRankingCriteria.find(criteria => criteria.name === criteriaName)?.id;

    if (!criteriaId) {
      toast.error('Critério não encontrado')
      return
    }

    await RemoveRankingCriteriaFn({
      criteriaId,
      rankingId: rankingCreated.id,
    });


    setSuggestedRankingCriteria(
      previousState => previousState.map(item => {
        if (item.name === criteriaName) {
          return {
            ...item,
            loading: false,
          }
        }
        return item
      })
    )

    setSelectedRankingCriteria(previousState => previousState.filter(criteria => criteria.id !== criteriaId))
    toast.success('Critérios removido com sucesso')
  }

  async function handleCreateRankingCriteriaCustom(criteria: string) {
    if (!rankingCreated) {
      toast.error('Crie um ranking primeiro')
      return
    }
    const criteriaCreated = await CreateRankingCriteriaFn({
      rankingId: rankingCreated.id,
      criteria,
    });


    setSelectedRankingCriteria([...selectedRankingCriteria, {
      id: criteriaCreated.id,
      name: criteria,
      loading: false,
    }])
    setSuggestedRankingCriteria([...suggestedRankingCriteria, {
      id: criteriaCreated.id,
      name: criteria,
      loading: false,
    }])

    setRankingCriteriaName('')
    setIsModalVisible(false)

    toast.success('Critérios adicionado com sucesso')
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
          <Button title='Criar ranking' iconLeft={<Trophy color={Colors.white} />} onPress={handleCreateRanking} loading={isCreatingRankingLoading} />
        </ProgressStep>
        <ProgressStep label="Foto de capa" removeBtnRow>
          <View>
            <TextTitle fontWeight={theme.weights.lg}>Agora escolha uma foto 📷</TextTitle>
            <ImagePicker onPress={openImagePicker} image={image} loading={loadingImage || isUploadingFileLoading} />
            <Button
              title='Continuar'
              iconLeft={<PaperPlaneRight color={Colors.white} />}
              onPress={handleUpdateRanking}
              loading={isUpdatingRankingLoading}
            />
          </View>
        </ProgressStep>
        <ProgressStep label="Critérios" removeBtnRow viewProps={{
          style: {
            flex: 1,
            backgroundColor: 'black'
          }
        }}>
          <View style={{ flex: 1, justifyContent: 'space-between', alignContent: 'space-between' }}>
            <TextTitle fontWeight={theme.weights.lg}>Escolha alguns critérios 🕵</TextTitle>
            <View style={{ flex: 1, alignItems: 'center' }}>
              <View style={{
                flexDirection: 'row',
                flexWrap: 'wrap',
                marginTop: theme.padding.sm,
                marginBottom: theme.padding.sm,
                justifyContent: 'center',
              }}>
                {suggestedRankingCriteria.length > 0 ? (
                  suggestedRankingCriteria.map((item, index) => (
                    <RankingCriteriaSuggest
                      id={index.toString()}
                      key={index.toString()}
                      name={item.name}
                      loading={item.loading}
                      selected={selectedRankingCriteria.some(criteria => criteria.name === item.name)}
                      onPress={() => {
                        if (selectedRankingCriteria.some(criteria => criteria.name === item.name)) {
                          handleRemoveRankingCriteria(item.name)
                        } else {
                          handleCreateRankingCriteria(item.name)
                        }
                      }}
                    />
                  ))
                ) : (
                  <Show when={isGetRankingCriteriaSuggestLoading}>
                    <ActivityIndicator color={Colors.darkTint} />
                  </Show>
                )}

                <Show when={!isGetRankingCriteriaSuggestLoading}>
                  <NewRankingCriteriaSuggest
                    name='Novo'
                    onPress={() => {
                      setIsModalVisible(true)
                      hapticFeedback(HapticsType.SUCCESS)
                    }}
                  />
                </Show>
              </View>
            </View>
            <View style={{flex: 1, alignContent: 'flex-end', marginTop: 100}}>
                <Button
                  title='Finalizar'
                  iconLeft={<Check color={Colors.white} />}
                  onPress={() => {
                    hapticFeedback(HapticsType.SUCCESS)
                    navigationService.navigate('HomeScreen')
                  }}
                  loading={isCreatingRankingLoading}
                />
            </View>
          </View>
        </ProgressStep>
      </ProgressSteps>
          <Modal isVisible={isModalVisible} onBackdropPress={() => setIsModalVisible(false)}>
            <View style={styles.contentContainer}>
              <TextTitle fontWeight={theme.weights.lg}>Criar novo critério</TextTitle>
              <TextField placeholder="" value={rankingCriteriaName} onChangeText={setRankingCriteriaName} hasError={false} label='Critério' autoFocus />
              <Button
                title='Criar'
                onPress={() => handleCreateRankingCriteriaCustom(rankingCriteriaName)}
                loading={isCreatingRankingCriteriaLoading}
              />
            </View>
          </Modal>
    </Container>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 24,
    backgroundColor: '#eaeaea',
  },
  contentContainer: {
    maxHeight: 250,
    height: 250,
    padding: 36,
    borderRadius: 8,
    marginBottom: 200,
    backgroundColor: Colors.white,
  },
})