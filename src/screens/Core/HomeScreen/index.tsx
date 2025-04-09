import React from 'react';
import {FlatList, TouchableOpacity, View} from "react-native";
import {PlusCircle} from 'phosphor-react-native'
import {Container, Content} from "~/components/BaseScreen";
import {TextTitle} from "~/components/Typography/TextTitle";
import RankingItem from "~/components/RankingItem";
import theme from "~/theme";
import {Row} from "~/components/Row";
import { useQuery } from '@tanstack/react-query';
import { QuerieKeys } from '~/api/resources/querie-keys';
import { GetRankingsByUser } from '~/api/resources/core/get-ranking-by-user';
import navigationService from '~/services/navigation.service';

interface Props {
    // Define your props here
}

export default function HomeScreen() {
    const { data: rankings, isLoading, error } = useQuery({
        queryKey: [QuerieKeys.GetRankingsByUser],
        queryFn: GetRankingsByUser,
        networkMode: 'online',
        retry: 2,
    });

    function handleCreateRanking() {
        navigationService.navigate('Home', {
            screen: 'CreateRankingScreen',
        });
    }

    return (
        <Container>
            <Content>
                <Row>
                    <TextTitle fontWeight={theme.weights.lg}>{`Oi Mateus, \nSeus Rankings`}</TextTitle>
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
                    renderItem={({item}) => <RankingItem onPress={() => {}} title={item.name} photo={item.banner} />}
                    showsVerticalScrollIndicator={false}
                />
            </Content>
        </Container>
    );
};
