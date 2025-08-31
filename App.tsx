import './src/config/reactotron';
import { QueryClientProvider } from '@tanstack/react-query';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { BottomSheetModalProvider } from '@gorhom/bottom-sheet';
import * as SplashScreen from 'expo-splash-screen';

import RootStack from "~/navigation/RootStack.navigation";
import { queryClient } from "~/lib/react-query";
import { NavigationContainer } from "@react-navigation/native";
import NavigationService from "~/services/navigation.service";
import { Toaster } from "sonner-native";
import { ThemeProvider } from "styled-components";
import theme from "~/theme";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { UserProvider } from "~/context/UserContext";

// Prevent the splash screen from auto-hiding before App component declaration
SplashScreen.preventAutoHideAsync();
console.log('🚀 App started, splash screen prevented from auto-hiding');

export default function App() {
    return (
        <QueryClientProvider client={queryClient}>
            <SafeAreaProvider>
                <GestureHandlerRootView style={{ flex: 1 }}>
                    <BottomSheetModalProvider>
                        <UserProvider>
                            <ThemeProvider theme={theme}>
                                <NavigationContainer ref={(navigatorRef) => {
                                    if (navigatorRef) {
                                        NavigationService.setNavigationRef(
                                            navigatorRef as any
                                        );
                                    }
                                }}>
                                    <RootStack />
                                    <Toaster position={'bottom-center'} offset={80} />
                                </NavigationContainer>
                            </ThemeProvider>
                        </UserProvider>
                    </BottomSheetModalProvider>
                </GestureHandlerRootView>
            </SafeAreaProvider>
        </QueryClientProvider>
    );
}