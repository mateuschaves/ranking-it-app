import { useRoute, RouteProp } from '@react-navigation/native';
import React, { useRef } from 'react';
import { GetRankingsByUserResponse } from '~/api/resources/core/get-ranking-by-user';
import {
  View,
  StyleSheet,
  Animated,
  Dimensions,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import { TextTitle } from '~/components/Typography/TextTitle';
import theme from '~/theme';
import { NormalText } from '~/components/Typography/NormalText';
import { useQuery } from '@tanstack/react-query';
import { GetRankingItems } from '~/api/resources/core/get-ranking-items';
import { QuerieKeys } from '~/api/resources/querie-keys';
import { CaretRight, PlusCircle, UserPlus } from 'phosphor-react-native';
import Divider from '~/components/Divider';
import Whitespace from '~/components/Whitespace';
import CachedImage from 'expo-cached-image';
import { ActivityIndicator } from 'react-native';
import Colors from '~/theme/colors';
import InviteUserModal from '~/components/InviteUserModal';
import { InviteUserToRanking } from '~/api/resources/core/invite-user-to-ranking';
import { showToast, hapticFeedback, HapticsType } from '~/utils/feedback';
import { useMutation } from '@tanstack/react-query';

import constants from '~/config/consts';
import navigationService from '~/services/navigation.service';
import { RootStackParamList } from '~/navigation/navigation.type';

const HEADER_MAX_HEIGHT = 250;
const HEADER_MIN_HEIGHT = 60;
const HEADER_SCROLL_DISTANCE = HEADER_MAX_HEIGHT - HEADER_MIN_HEIGHT;

export default function RankingDetailScreen() {
  const scrollY = useRef(new Animated.Value(0)).current;
  const [inviteModalVisible, setInviteModalVisible] = React.useState(false);

  const route = useRoute<RouteProp<RootStackParamList, 'RankingDetailScreen'>>();
  const { item } = route.params;

  const { data: rankingItems } = useQuery({
    queryKey: [QuerieKeys.GetRankingItems, item.id],
    queryFn: () => GetRankingItems({ id: item.id }),
  });

  const headerHeight = scrollY.interpolate({
    inputRange: [0, HEADER_SCROLL_DISTANCE],
    outputRange: [HEADER_MAX_HEIGHT, HEADER_MIN_HEIGHT],
    extrapolate: 'clamp',
  });

  const headerOpacity = scrollY.interpolate({
    inputRange: [0, HEADER_SCROLL_DISTANCE / 2, HEADER_SCROLL_DISTANCE],
    outputRange: [1, 0.7, 0.3],
    extrapolate: 'clamp',
  });

  const imageTranslate = scrollY.interpolate({
    inputRange: [0, HEADER_SCROLL_DISTANCE],
    outputRange: [0, -30],
    extrapolate: 'clamp',
  });

  function handleClickRankingItem(id: string) {
    navigationService.navigate('RankingItemDetailScreen', {
      rankingItemId: id,
      rankingId: item.id
    });
  }

  const {
    mutateAsync: inviteUserToRankingFn,
    isPending: isInviteLoading,
  } = useMutation({
    mutationFn: InviteUserToRanking,
    mutationKey: [QuerieKeys.InviteUserToRanking, item.id],
    onSuccess: () => {
      setInviteModalVisible(false);
      showToast({ type: 'success', title: 'Convite enviado com sucesso!' });
      hapticFeedback(HapticsType.SUCCESS);
    },
    onError: () => {
      showToast({ type: 'error', title: 'Erro ao enviar convite. Tente novamente.' });
      hapticFeedback(HapticsType.ERROR);
    },
  });

  async function handleInviteUser(email: string) {
    await inviteUserToRankingFn({ email, rankingId: item.id });
  }

  const headerImageUri = item.banner?.name
    ? `${constants.bucketUrl}/${item.banner.name}`
    : constants.bannerPlaceholder;

  return (
    <View style={styles.container}>
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={{ paddingTop: HEADER_MAX_HEIGHT }}
        onScroll={Animated.event(
          [{ nativeEvent: { contentOffset: { y: scrollY } } }],
          { useNativeDriver: false }
        )}
        scrollEventThrottle={8}
        showsVerticalScrollIndicator={false}
        bounces={true}
      >
        <View style={styles.content}>
          <View style={styles.headerContent}>
            <View style={styles.titleContainer}>
              <TextTitle fontWeight={theme.weights.lg}>
                {item.name || 'No title available.'}
              </TextTitle>
              <NormalText fontWeight={theme.weights.md}>
                {item.description || 'No description available.'}
              </NormalText>
            </View>
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <TouchableOpacity
                style={styles.addButton}
                onPress={() => setInviteModalVisible(true)}
              >
                <UserPlus size={40} color={theme.colors.darkTint} />
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.addButton}
                onPress={() => {
                  navigationService.navigate('CreateRankingItemScreen', {
                    rankingId: item.id
                  })
                }}
              >
                <PlusCircle
                  size={40}
                  color={theme.colors.darkTint}
                />
              </TouchableOpacity>
            </View>
          </View>

          <Whitespace space={16} />

          {rankingItems?.map((item, index) => (
            <View key={item.id}>
              <TouchableOpacity
                style={styles.itemContainer}
                onPress={() => handleClickRankingItem(item.id)}
                activeOpacity={0.7}
              >
                <View style={styles.itemContent}>
                  <NormalText fontWeight={theme.weights.md}>
                    {index + 1}° {item.name || 'No title available.'}
                  </NormalText>
                </View>
                <CaretRight size={20} color={theme.colors.darkTint} />
              </TouchableOpacity>
              <Divider />
            </View>
          ))}

          {(!rankingItems || rankingItems.length === 0) && (
            <View style={styles.emptyState}>
              <NormalText fontWeight={theme.weights.md}>
                Nenhum item adicionado ainda. Clique no + para adicionar o primeiro item!
              </NormalText>
            </View>
          )}
        </View>
      </ScrollView>

      <Animated.View style={[styles.header, { height: headerHeight }]}>
        <Animated.View style={[
          styles.headerImageContainer,
          { opacity: headerOpacity, transform: [{ translateY: imageTranslate }] },
        ]}>
          <CachedImage
            style={styles.headerImage}
            cacheKey={`ranking-detail-banner-${item.banner?.name || 'placeholder'}`}
            placeholderContent={(
              <ActivityIndicator
                color={Colors.white}
                size="large"
                style={{ flex: 1, justifyContent: "center" }}
              />
            )}
            source={{ uri: headerImageUri }}
            resizeMode="cover"
            onError={(error: any) => {
              console.warn('Header image loading error:', error);
            }}
          />
        </Animated.View>
      </Animated.View>

      <InviteUserModal
        visible={inviteModalVisible}
        onClose={() => setInviteModalVisible(false)}
        onInvite={handleInviteUser}
        loading={isInviteLoading}
        onSuccess={() => { }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  scrollView: {
    flex: 1,
  },
  content: {
    padding: 16,
    paddingBottom: 120, // Add extra padding to account for bottom navigation
  },
  headerContent: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    marginBottom: theme.margin.xl
  },
  titleContainer: {
    flex: 1,
    marginRight: 16,
  },
  addButton: {
    padding: 8,
  },
  itemContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 16,
    paddingHorizontal: 8,
  },
  itemContent: {
    flex: 1,
    marginRight: 16,
  },
  emptyState: {
    alignItems: 'center',
    paddingVertical: 40,
    paddingHorizontal: 20,
  },
  header: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    overflow: 'hidden',
    backgroundColor: '#000',
    zIndex: 1,
  },
  headerImageContainer: {
    width: Dimensions.get('window').width,
    height: HEADER_MAX_HEIGHT,
  },
  headerImage: {
    width: Dimensions.get('window').width,
    height: HEADER_MAX_HEIGHT,
  },
});