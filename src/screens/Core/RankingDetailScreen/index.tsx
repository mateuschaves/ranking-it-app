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
import { NormalText } from '~/components/Typography/NormalText';
import { useQuery } from '@tanstack/react-query';
import { GetRankingItems } from '~/api/resources/core/get-ranking-items';
import { QuerieKeys } from '~/api/resources/querie-keys';
import { CaretRight, PlusCircle, UserPlus, Star, Trophy } from 'phosphor-react-native';
import Whitespace from '~/components/Whitespace';
import CachedImage from 'expo-cached-image';
import { ActivityIndicator } from 'react-native';
import Colors from '~/theme/colors';
import InviteUserModal from '~/components/InviteUserModal/index';
import { InviteUserToRanking } from '~/api/resources/core/invite-user-to-ranking';
import { showToast, hapticFeedback, HapticsType } from '~/utils/feedback';
import { useMutation } from '@tanstack/react-query';

import constants from '~/config/consts';
import navigationService from '~/services/navigation.service';
import { RootStackParamList } from '~/navigation/navigation.type';

const HEADER_MAX_HEIGHT = 280;
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
    outputRange: [1, 0.8, 0.4],
    extrapolate: 'clamp',
  });

  const imageTranslate = scrollY.interpolate({
    inputRange: [0, HEADER_SCROLL_DISTANCE],
    outputRange: [0, -40],
    extrapolate: 'clamp',
  });

  const titleOpacity = scrollY.interpolate({
    inputRange: [0, HEADER_SCROLL_DISTANCE / 2, HEADER_SCROLL_DISTANCE],
    outputRange: [1, 0.9, 0.6],
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

  const headerImageUri = item.banner || 'https://via.placeholder.com/400x280/EDEAE4/999999?text=Sem+Imagem'

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
          {/* Title Section */}
          <View style={styles.titleSection}>
            <TextTitle style={styles.contentTitle}>
              {item.name || 'Sem título'}
            </TextTitle>
            <NormalText style={styles.contentDescription}>
              {item.description || 'Sem descrição'}
            </NormalText>
          </View>

          {/* Actions Section */}
          <View style={styles.actionsSection}>
            <TouchableOpacity
              style={styles.actionButton}
              onPress={() => setInviteModalVisible(true)}
              activeOpacity={0.8}
            >
              <UserPlus size={18} color={Colors.darkTint} weight="bold" />
              <NormalText style={styles.actionButtonText}>
                Convidar
              </NormalText>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.actionButton, styles.primaryActionButton]}
              onPress={() => {
                navigationService.navigate('CreateRankingItemScreen', {
                  rankingId: item.id
                })
              }}
              activeOpacity={0.8}
            >
              <PlusCircle size={18} color={Colors.white} weight="bold" />
              <NormalText style={[styles.actionButtonText, styles.primaryActionButtonText]}>
                Adicionar
              </NormalText>
            </TouchableOpacity>
          </View>

          <Whitespace space={24} />

          {/* Items Section */}
          <View style={styles.itemsSection}>
            <TextTitle style={styles.sectionTitle}>
              Itens do Ranking
            </TextTitle>

            {rankingItems?.map((rankingItem, index) => (
              <TouchableOpacity
                key={rankingItem.id}
                style={styles.itemCard}
                onPress={() => handleClickRankingItem(rankingItem.id)}
                activeOpacity={0.8}
              >
                <View style={styles.itemHeader}>
                  <View style={styles.positionBadge}>
                    <NormalText style={styles.positionText}>
                      {index + 1}º
                    </NormalText>
                  </View>

                  <View style={styles.itemInfo}>
                    <TextTitle style={styles.itemName}>
                      {rankingItem.name || 'Sem nome'}
                    </TextTitle>
                    {rankingItem.description && (
                      <NormalText style={styles.itemDescription}>
                        {rankingItem.description}
                      </NormalText>
                    )}
                  </View>

                  <View style={styles.itemScore}>
                    <Star size={16} color={Colors.darkTint} weight="fill" />
                    <NormalText style={styles.scoreText}>
                      {rankingItem.score ? rankingItem.score.toFixed(1) : '0.0'}
                    </NormalText>
                  </View>

                  <CaretRight size={20} color={Colors.darkTint} weight="bold" />
                </View>
              </TouchableOpacity>
            ))}

            {(!rankingItems || rankingItems.length === 0) && (
              <View style={styles.emptyState}>
                <View style={styles.emptyIconContainer}>
                  <Trophy size={64} color={Colors.textHiglight} weight="light" />
                </View>
                <TextTitle style={styles.emptyTitle}>
                  Nenhum item ainda
                </TextTitle>
                <NormalText style={styles.emptySubtitle}>
                  Adicione o primeiro item ao ranking para começar!
                </NormalText>
              </View>
            )}
          </View>
        </View>
      </ScrollView>

      {/* Header */}
      <Animated.View style={[styles.header, { height: headerHeight }]}>
        <Animated.View style={[
          styles.headerImageContainer,
          { opacity: headerOpacity, transform: [{ translateY: imageTranslate }] },
        ]}>
          <CachedImage
            style={styles.headerImage}
            cacheKey={`ranking-detail-banner-${item.banner || 'placeholder'}`}
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
          <View style={styles.headerOverlay} />
        </Animated.View>
      </Animated.View>

      <InviteUserModal
        visible={inviteModalVisible}
        onClose={() => setInviteModalVisible(false)}
        onInvite={handleInviteUser}
        loading={isInviteLoading}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  scrollView: {
    flex: 1,
  },
  content: {
    paddingHorizontal: 16,
    paddingBottom: 120,
  },
  titleSection: {
    marginBottom: 24,
    marginTop: 16,
  },
  contentTitle: {
    fontSize: 28,
    fontWeight: '700',
    color: Colors.darkTint,
    marginBottom: 8,
  },
  contentDescription: {
    fontSize: 16,
    color: Colors.textHiglight,
    lineHeight: 22,
  },
  actionsSection: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 8,
  },
  actionButton: {
    flex: 1,
    backgroundColor: Colors.background,
    borderRadius: 12,
    paddingVertical: 12,
    paddingHorizontal: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: Colors.darkTint,
  },
  primaryActionButton: {
    backgroundColor: Colors.darkTint,
    borderColor: Colors.darkTint,
  },
  actionButtonText: {
    color: Colors.darkTint,
    fontSize: 14,
    fontWeight: '600',
    marginLeft: 6,
  },
  primaryActionButtonText: {
    color: Colors.white,
  },
  itemsSection: {
    marginTop: 8,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: Colors.darkTint,
    marginBottom: 16,
  },
  itemCard: {
    backgroundColor: Colors.white,
    borderRadius: 16,
    padding: 20,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 3,
  },
  itemHeader: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  positionBadge: {
    backgroundColor: Colors.darkTint,
    borderRadius: 20,
    paddingHorizontal: 12,
    paddingVertical: 6,
    marginRight: 16,
    minWidth: 40,
    alignItems: 'center',
  },
  positionText: {
    color: Colors.white,
    fontSize: 16,
    fontWeight: '700',
  },
  itemInfo: {
    flex: 1,
    marginRight: 16,
  },
  itemName: {
    fontSize: 18,
    fontWeight: '600',
    color: Colors.darkTint,
    marginBottom: 4,
  },
  itemDescription: {
    fontSize: 14,
    color: Colors.textHiglight,
    lineHeight: 18,
  },
  itemScore: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.background,
    borderRadius: 12,
    paddingHorizontal: 8,
    paddingVertical: 4,
    marginRight: 12,
  },
  scoreText: {
    fontSize: 14,
    fontWeight: '700',
    color: Colors.darkTint,
    marginLeft: 4,
  },
  emptyState: {
    alignItems: 'center',
    paddingVertical: 60,
  },
  emptyIconContainer: {
    marginBottom: 24,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: Colors.darkTint,
    marginBottom: 8,
    textAlign: 'center',
  },
  emptySubtitle: {
    fontSize: 16,
    color: Colors.textHiglight,
    textAlign: 'center',
    lineHeight: 22,
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
  headerOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
  },
});