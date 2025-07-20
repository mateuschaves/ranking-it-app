import React from 'react';
import {
    AnimatedTabBarNavigator, DotSize, TabElementDisplayOptions,
} from 'react-native-animated-nav-tab-bar'

import { House, User } from 'phosphor-react-native'

import Colors from "~/theme/colors";
import ProfileScreen from "~/screens/Core/ProfileScreen";
import RankingNavigation from './Ranking.navigation';
import { useUserContext } from '~/context/UserContext';
import { View, StyleSheet, Text } from 'react-native';

const Tabs = AnimatedTabBarNavigator();

export default function BottomNavigation() {
    const { user } = useUserContext();
    return (
        <Tabs.Navigator
            tabBarOptions={{
                activeTintColor: Colors.darkTint,
                inactiveTintColor: Colors.background,
                activeBackgroundColor: Colors.darkTint,
            }}
            appearance={{
                shadow: true,
                floating: true,
                whenActiveShow: TabElementDisplayOptions.ICON_ONLY,
                dotSize: DotSize.SMALL,
            }}
        >
            <Tabs.Screen options={{
                tabBarIcon: ({ focused, color, size }: { focused: boolean; color: string; size: number }) => (
                    <House
                        size={size ? size : 40}
                        color={focused ? Colors.white : Colors.darkTint}

                    />
                )
            }} name="Home" component={RankingNavigation} />

            <Tabs.Screen options={{
                tabBarIcon: ({ focused, color, size }: { focused: boolean; color: string; size: number }) => (
                    <View style={{ width: size || 40, height: size || 40, justifyContent: 'center', alignItems: 'center' }}>
                        <User
                            size={size ? size : 40}
                            color={focused ? Colors.white : Colors.darkTint}
                        />
                        {user?.pendingInvitesCount && user.pendingInvitesCount > 0 && (
                            <View style={styles.badge} pointerEvents="none">
                                <View style={[styles.badgeInner, focused && styles.badgeInnerFocused]}>
                                    <Text style={[styles.badgeText, focused && styles.badgeTextFocused]}>{user.pendingInvitesCount}</Text>
                                </View>
                            </View>
                        )}
                    </View>
                )
            }} name="ProfileScreen" component={ProfileScreen} />
        </Tabs.Navigator>
    )
}

const styles = StyleSheet.create({
    badge: {
        position: 'absolute',
        top: -4,
        right: -4,
        zIndex: 20,
        elevation: 3,
        backgroundColor: 'transparent',
    },
    badgeInner: {
        backgroundColor: Colors.darkTint,
        borderRadius: 7,
        minWidth: 14,
        height: 14,
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: 3,
    },
    badgeText: {
        color: Colors.white,
        fontSize: 9,
        fontWeight: 'bold',
    },
    badgeInnerFocused: {
        backgroundColor: Colors.white,
    },
    badgeTextFocused: {
        color: Colors.darkTint,
    },
});