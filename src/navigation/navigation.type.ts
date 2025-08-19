import { GetRankingsByUserResponse } from '~/api/resources/core/get-ranking-by-user';

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
    RankingDetailScreen: {
        item: GetRankingsByUserResponse;
    };
    RankingItemDetailScreen: RankingItemDetailScreenProps;
    CreateRankingItemScoreScreen: RankingItemDetailScreenProps;
    CreateRankingItemScreen: CreateRankingItemScreenProps;
    ProfilePhotoScreen: undefined;
    UserPendingInvitesScreen: undefined;
}

export type PublicStackParamList = {
    PublicStack: undefined;
    PrivateStack: undefined;
}

