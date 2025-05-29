import { View } from 'react-native'
import React, { useEffect, useState } from 'react'
import Colors from '~/theme/colors'
import theme from '~/theme'
import { Content } from '~/components/BaseScreen'
import { useMutation, useQuery } from '@tanstack/react-query'
import { QuerieKeys } from '~/api/resources/querie-keys'
import { GetRankingCriteria } from '~/api/resources/core/get-ranking-criteria'
import { RouteProp, useRoute } from '@react-navigation/native'
import { RootStackParamList } from '~/navigation/navigation.type'
import RankingCriteriaSuggest from '~/components/RankingCriteriaSuggest'
import TextField from '~/components/TextField'
import { NormalText } from '~/components/Typography/NormalText'
import { TextTitle } from '~/components/Typography/TextTitle'
import { GetRankingCriteriaResponse } from '~/api/resources/core/get-ranking-criteria';
import Button from '~/components/Button'
import { CreateRankingCriteriaScore } from '~/api/resources/core/create-ranking-criteria-score'
import { GetRankingItemScores } from '~/api/resources/core/get-ranking-item-votes'
import { queryClient } from '~/lib/react-query'
import navigationService from '~/services/navigation.service'

type RankingItemCriteriaScore = {
    score?: number;
} & GetRankingCriteriaResponse;

export default function CreateRankingItemScoreScreen() {
    const { params } = useRoute<RouteProp<RootStackParamList, 'CreateRankingItemScoreScreen'>>();
    const [rankingItemCriteriaScore, setRankingItemCriteriaScore] = useState([] as RankingItemCriteriaScore[]);
    const [selectedItemCriteria, setSelectedItemCriteria] = useState<GetRankingCriteriaResponse | null>(null);
    const [score, setScore] = useState(0);

    const {
        data: rankingCriteria,
    } = useQuery({
        queryKey: [QuerieKeys.GetRankingCriteria, params.rankingItemId],
        queryFn: () => GetRankingCriteria({ id: params.rankingId }),
        networkMode: 'online',
        retry: 2,
    });

    const {
        data: rankingItemScores,
    } = useQuery({
        queryKey: [QuerieKeys.GetRankingItemsScores, params.rankingItemId, params.rankingId],
        queryFn: () => GetRankingItemScores({ rankingItemId: params.rankingItemId, rankingId: params.rankingId }),
        networkMode: 'online',
        retry: 2,
    })

    const {
        mutateAsync: createRankingCriteriaScoreMutateAsync,
        isPending: isCreatingRankingCriteriaScore,
    } = useMutation({
        mutationFn: async (data: { rankingItemId: string; rankingId: string; rankingCriteriaId: string; score: number }) => {
            const response = await CreateRankingCriteriaScore({
                rankingItemId: data.rankingItemId,
                rankingId: data.rankingId,
                rankingCriteriaId: data.rankingCriteriaId,
                score: data.score,
            });

            queryClient.invalidateQueries({
                queryKey: [QuerieKeys.GetRankingItemsScores],
            });
            return response;
        }
    })


    async function handleCriteriaSelect(criteria: GetRankingCriteriaResponse) {
        if (selectedItemCriteria?.id === criteria.id) {
            setSelectedItemCriteria(null);
            return;
        }

        setScore(
            rankingItemCriteriaScore.find(item => item.id === criteria.id)?.score || 0
        )
        setSelectedItemCriteria(criteria);
    }

    async function handleScoreChange(criteriaId?: string, score?: string) {
        setScore(Number(score?.replace(',', '.')) || 0);
        if (!criteriaId) return;
        setRankingItemCriteriaScore(prev => {
            const updatedCriteria = prev.map(item => {
                if (item.id === criteriaId) {
                    return { ...item, score: Number(score) };
                }
                return item;
            }
            );
            return updatedCriteria;
        });
    }

    useEffect(() => {
        setRankingItemCriteriaScore(rankingCriteria?.map(criteria => ({
            id: criteria.id,
            rankingId: criteria.rankingId,
            name: criteria.name,
            createdAt: criteria.createdAt,
            updatedAt: criteria.updatedAt,
            score: rankingItemScores?.find(item => item.rankingCriteria.id === criteria.id)?.score || 0,
        } as RankingItemCriteriaScore)) || [] as RankingItemCriteriaScore[]);

        rankingCriteria?.length && setSelectedItemCriteria(rankingCriteria[0] || null);
    }, [rankingCriteria, rankingItemScores]);

    if (!rankingCriteria) {
        return (
            <View style={{ flex: 1, backgroundColor: Colors.background, paddingTop: theme.padding.xl + 20 }}>
                <TextTitle style={{ textAlign: 'center', marginTop: theme.margin.lg }}>
                    Carregando critérios de ranqueamento...
                </TextTitle>
            </View>
        );
    }

    async function handleSaveAddScore() {
        await Promise.all(rankingItemCriteriaScore
                .filter(criteria => criteria.score)
                .map(async (criteria) => {
                    createRankingCriteriaScoreMutateAsync({
                        rankingItemId: params.rankingItemId,
                        rankingId: params.rankingId,
                        rankingCriteriaId: criteria.id,
                        score: criteria.score || 0,
                    });
                }));

        navigationService.goBack();
        

        setSelectedItemCriteria(null);
        setScore(0);
        setRankingItemCriteriaScore([]);
    }

    return (
        <View style={{ flex: 1, backgroundColor: Colors.background, paddingTop: theme.padding.xl + 20 }}>
            <Content>
                <View style={{
                    flexDirection: 'row',
                    flexWrap: 'wrap',
                    marginTop: theme.padding.sm,
                    marginBottom: theme.padding.sm,
                    justifyContent: 'center',
                }}>
                    {
                        rankingCriteria?.map((criteria) => (
                            <RankingCriteriaSuggest
                                id={criteria.id}
                                name={`${criteria.name} (${rankingItemCriteriaScore.find(item => item.id === criteria.id)?.score || 0})`}
                                onPress={() => handleCriteriaSelect(criteria)}
                                selected={selectedItemCriteria?.id === criteria.id}
                                key={criteria.id}
                            />
                        ))
                    }
                </View>

                <View style={{
                    flexDirection: 'row',
                    justifyContent: 'center',
                    alignItems: 'center',
                    width: '100%',
                    alignSelf: 'center',
                    marginTop: theme.margin.xl,
                }}>
                    <View>
                        <NormalText style={{ fontWeight: 'bold', fontSize: 25 }}>
                            Qual a nota para {selectedItemCriteria?.name} ?
                        </NormalText>
                        <TextField
                            value={score.toString()}
                            placeholder=''
                            autoFocus
                            keyboardType='numeric'
                            onChangeText={(text) => handleScoreChange(selectedItemCriteria?.id, text)}
                            hasError={false}
                            style={{
                                marginTop: theme.margin.sm,
                                width: 80,
                                height: 70,
                                fontSize: 20,
                                alignSelf: 'center',
                                alignContent: 'center',
                                textAlign: 'center',
                            }}
                        />
                    </View>
                </View>

                <Button 
                    title='Salvar'
                    loading={isCreatingRankingCriteriaScore}
                    onPress={handleSaveAddScore}
                />
            </Content>
        </View>
    )
}