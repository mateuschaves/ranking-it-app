import './src/config/reactotron';
import { QueryClientProvider } from '@tanstack/react-query';
import { GestureHandlerRootView } from 'react-native-gesture-handler';

import RootStack from "~/navigation/RootStack.navigation";
import {queryClient} from "~/lib/react-query";
import {NavigationContainer} from "@react-navigation/native";
import NavigationService from "~/services/navigation.service";
import {Toaster} from "sonner-native";
import {ThemeProvider} from "styled-components";
import theme from "~/theme";
import {SafeAreaProvider} from "react-native-safe-area-context";
import {UserProvider} from "~/context/UserContext";

export default function App() {
  return (
      <QueryClientProvider client={queryClient}>
          <SafeAreaProvider>
            <GestureHandlerRootView>
                <UserProvider>
                    <ThemeProvider theme={theme}>
                        <NavigationContainer ref={(navigatorRef) => {
                            NavigationService.setNavigationRef(
                                navigatorRef
                            );
                        }}>
                            <RootStack />
                            <Toaster position={'bottom-center'} offset={80} />
                        </NavigationContainer>
                    </ThemeProvider>
                </UserProvider>
            </GestureHandlerRootView>
          </SafeAreaProvider>
      </QueryClientProvider>
  );
}