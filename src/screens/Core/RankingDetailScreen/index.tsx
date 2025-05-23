import { useRoute } from '@react-navigation/native';
import React, { useRef } from 'react';
import { GetRankingsByUserResponse } from '~/api/resources/core/get-ranking-by-user';
import {
  View,
  StyleSheet,
  Animated,
  Dimensions,
  TouchableOpacity,
  Image
} from 'react-native';
import { TextTitle } from '~/components/Typography/TextTitle';
import theme from '~/theme';
import { NormalText } from '~/components/Typography/NormalText';
import { useQuery } from '@tanstack/react-query';
import { GetRankingItems } from '~/api/resources/core/get-ranking-items';
import { QuerieKeys } from '~/api/resources/querie-keys';
import { CaretRight } from 'phosphor-react-native';
import Divider from '~/components/Divider';
import Whitespace from '~/components/Whitespace';
import Show from '~/components/Standart/Show';

import constants from '~/config/consts';
import navigationService from '~/services/navigation.service';

const HEADER_MAX_HEIGHT = 300;
const HEADER_MIN_HEIGHT = 60;
const HEADER_SCROLL_DISTANCE = HEADER_MAX_HEIGHT - HEADER_MIN_HEIGHT;

export default function RankingDetailScreen() {
  const scrollY = useRef(new Animated.Value(0)).current;

const {params} = useRoute<{ params: { item: GetRankingsByUserResponse } }>();

const { data: rankingItems, isLoading, error } = useQuery({
    queryKey: [QuerieKeys.GetRankingItems, params.item.id],
    queryFn: () => GetRankingItems({ id: params.item.id }),
});


  const headerHeight = scrollY.interpolate({
    inputRange: [0, HEADER_SCROLL_DISTANCE],
    outputRange: [HEADER_MAX_HEIGHT, HEADER_MIN_HEIGHT],
    extrapolate: 'clamp',
  });

  const headerOpacity = scrollY.interpolate({
    inputRange: [0, HEADER_SCROLL_DISTANCE / 2, HEADER_SCROLL_DISTANCE],
    outputRange: [1, 0.5, 0],
    extrapolate: 'clamp',
  });

  const imageTranslate = scrollY.interpolate({
    inputRange: [0, HEADER_SCROLL_DISTANCE],
    outputRange: [0, -50],
    extrapolate: 'clamp',
  });

  function handleClickRankingItem(id: string) {
    navigationService.navigate('RankingItemDetailScreen', {
      rankingItemId: id,
      rankingId: params.item.id
    });
  }

  return (
    <View style={styles.container}>
      <Animated.ScrollView
        style={styles.scrollView}
        contentContainerStyle={{ paddingTop: HEADER_MAX_HEIGHT }}
        onScroll={Animated.event(
          [{ nativeEvent: { contentOffset: { y: scrollY } } }],
          { useNativeDriver: false }
        )}
        scrollEventThrottle={16}
      >
        <View style={styles.content}>
            <TextTitle fontWeight={theme.weights.lg}>
                {params.item.name || 'No title available.'}
            </TextTitle>
            <NormalText fontWeight={theme.weights.md}>
                {params.item.description || 'No description available.'}
            </NormalText>
            <Whitespace space={16} />
            {rankingItems?.map((item, index) => (
                <>
                    <TouchableOpacity key={item.id} style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginVertical: 16 }} onPress={() => handleClickRankingItem(item.id)}>
                      <View style={{ flexDirection: 'row', alignItems: 'center'}}>
                        <NormalText fontWeight={theme.weights.md}>
                            {++index + '° '}{item.name || 'No title available.'}
                        </NormalText>
                      </View>
                        <CaretRight />
                    </TouchableOpacity>
                    <Divider />
                </>
            ))}
        </View>
      </Animated.ScrollView>

      <Animated.View style={[styles.header, { height: headerHeight }]}>
        <Animated.Image
          style={[
            styles.headerImage,
            { opacity: headerOpacity, transform: [{ translateY: imageTranslate }] },
          ]}
          source={{ uri: `${constants.bucketUrl}/${params.item.banner.name}` || '', }}
        />
      </Animated.View>
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
  },
  contentText: {
    fontSize: 16,
    lineHeight: 24,
  },
  header: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    overflow: 'hidden',
    backgroundColor: '#000',
  },
  headerImage: {
    width: Dimensions.get('window').width,
    height: HEADER_MAX_HEIGHT,
    resizeMode: 'cover',
  },
});