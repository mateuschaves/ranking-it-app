import {
    AnimatedTabBarNavigator, DotSize, TabElementDisplayOptions,
} from 'react-native-animated-nav-tab-bar'

import { House, User } from 'phosphor-react-native'

import Colors from "~/theme/colors";
import ProfileScreen from "~/screens/Core/ProfileScreen";
import RankingNavigation from './Ranking.navigation';

const Tabs = AnimatedTabBarNavigator();

export default function BottomNavigation(){
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
                tabBarIcon: ({ focused, color, size }) => (
                    <House
                        size={size ? size : 40}
                        color={focused ? Colors.white : Colors.darkTint}
                        
                    />
                )
            }} name="Home" component={RankingNavigation} />

            <Tabs.Screen options={{
                tabBarIcon: ({ focused, color, size }) => (
                    <User
                        size={size ? size : 40}
                        color={focused ? Colors.white : Colors.darkTint}
                    />
                )
            }} name="ProfileScreen" component={ProfileScreen} />
        </Tabs.Navigator>
    )
}