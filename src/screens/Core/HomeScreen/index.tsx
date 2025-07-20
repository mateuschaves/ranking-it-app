import React, { useMemo, useRef } from 'react';
import { FlatList, TouchableOpacity, View } from "react-native";
import { PlusCircle } from 'phosphor-react-native'
import { Container, Content } from "~/components/BaseScreen";
import { TextTitle } from "~/components/Typography/TextTitle";
import RankingItem from "~/components/RankingItem";
import theme from "~/theme";
import { Row } from "~/components/Row";
import { useQuery } from '@tanstack/react-query';
import { QuerieKeys } from '~/api/resources/querie-keys';
import { GetRankingsByUser } from '~/api/resources/core/get-ranking-by-user';
import navigationService from '~/services/navigation.service';
import { NormalText } from '~/components/Typography/NormalText';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import BottomSheet, { BottomSheetMethods } from '@devvie/bottom-sheet';
import { GetRankingsByUserResponse } from '../../../api/resources/core/get-ranking-by-user';
import { useUserContext } from '~/context/UserContext';

interface Props {
    // Define your props here
}

export default function HomeScreen() {
    const { user } = useUserContext();
    const { data: rankings, isLoading, error } = useQuery({
        queryKey: [QuerieKeys.GetRankingsByUser],
        queryFn: GetRankingsByUser,
        networkMode: 'online',
        retry: 2,
    });

    const bottomSheetRef = useRef<BottomSheetMethods>(null);

    function handleCreateRanking() {
        navigationService.navigate('CreateRankingScreen');
    }

    function handleDetailRanking(item: GetRankingsByUserResponse) {
        navigationService.navigate('RankingDetailScreen', {
            item,
        });
    }

    return (
        <Container>
            <GestureHandlerRootView>
                <Content>
                    <Row>
                        <TextTitle fontWeight={theme.weights.lg}>{`Oi${user?.name ? ' ' + user.name : ''},\nSeus Rankings`}</TextTitle>
                        <TouchableOpacity onPress={handleCreateRanking}>
                            <PlusCircle
                                size={50}
                                color={theme.colors.darkTint}
                            />
                        </TouchableOpacity>
                    </Row>
                    <FlatList
                        data={rankings}
                        keyExtractor={item => item.id}
                        renderItem={({ item }) => <RankingItem onPress={() => handleDetailRanking(item)} onLongPress={() => { }} title={item.name} photo={item.banner} />}
                        showsVerticalScrollIndicator={false}
                        ListEmptyComponent={
                            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', minHeight: 280 }}>
                                <TextTitle fontWeight={theme.weights.md} style={{ textAlign: 'center', marginBottom: 6, fontSize: 18 }}>
                                    Nenhum ranking encontrado
                                </TextTitle>
                                <NormalText style={{ textAlign: 'center', color: theme.colors.textHiglight, fontSize: 14 }}>
                                    Crie seu primeiro ranking usando o botão + abaixo!
                                </NormalText>
                            </View>
                        }
                    />

                    <BottomSheet ref={bottomSheetRef} containerHeight={300} >
                        <TouchableOpacity onPress={() => { }}>
                            <NormalText >Excluir</NormalText>
                        </TouchableOpacity>
                    </BottomSheet>
                </Content>
            </GestureHandlerRootView>
        </Container>
    );
};
