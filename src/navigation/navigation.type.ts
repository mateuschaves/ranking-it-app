export interface RankingItemDetailScreenProps {
    rankingItemId: string;
    rankingId: string;
}

export interface CreateRankingItemScreenProps {
    rankingId: string;
}

export type RootStackParamList = {
    SignInScreen: undefined;
    SignUpScreen: undefined;
    SignUpEmailScreen: undefined;
    SignUpPasswordScreen: {
        email: string;
    }
    HomeScreen: undefined;
    BottomNavigator: undefined;
    CreateRankingScreen: undefined;
    RankingDetailScreen: undefined;
    RankingItemDetailScreen: RankingItemDetailScreenProps;
    CreateRankingItemScoreScreen: RankingItemDetailScreenProps;
    CreateRankingItemScreen: CreateRankingItemScreenProps;
}

export type PublicStackParamList = {
    PublicStack: undefined;
    PrivateStack: undefined;
}

