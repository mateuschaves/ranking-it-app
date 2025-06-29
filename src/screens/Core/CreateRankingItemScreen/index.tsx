import React, { useState } from 'react'
import { Container, Content } from '~/components/BaseScreen'
import Button from '~/components/Button'
import TextField from '~/components/TextField'

import Colors from '~/theme/colors'
import { useMutation } from '@tanstack/react-query'
import { CreateRankingItem } from '~/api/resources/core/create-ranking-item'
import { QuerieKeys } from '~/api/resources/querie-keys'
import { toast } from 'sonner-native'
import { View, StyleSheet } from 'react-native'
import { hapticFeedback, HapticsType } from '~/utils/feedback'
import navigationService from '~/services/navigation.service'
import { queryClient } from '~/lib/react-query'
import { useSafeAreaInsets } from 'react-native-safe-area-context'

interface CreateRankingItemScreenProps {
    route: {
        params: {
            rankingId: string
        }
    }
}

export default function CreateRankingItemScreen({ route }: CreateRankingItemScreenProps) {
    const { rankingId } = route.params
    const [itemName, setItemName] = useState<string>('')
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

    async function handleCreateRankingItem() {
        if (!itemName.trim()) {
            toast.error('Digite o nome do item')
            return
        }

        try {
            await CreateRankingItemFn({
                name: itemName.trim(),
                rankingId,
            })
        } catch (error) {
            console.error('Error in handleCreateRankingItem:', error)
        }
    }

    return (
        <Container>
            <Content>
                <View style={[styles.form, { paddingBottom: 32 + insets.bottom }]}>
                    <TextField
                        label="Nome do Item"
                        placeholder="Digite o nome do item"
                        value={itemName}
                        onChangeText={setItemName}
                        hasError={false}
                        maxLength={100}
                    />

                    <Button
                        title={isCreatingItemLoading ? 'Criando...' : 'Criar Item'}
                        onPress={handleCreateRankingItem}
                        loading={isCreatingItemLoading}
                    />
                </View>
            </Content>
        </Container>
    )
}

const styles = StyleSheet.create({
    header: {
        marginBottom: 24,
    },
    form: {
        gap: 16,
        marginTop: 40,
    },
}) 