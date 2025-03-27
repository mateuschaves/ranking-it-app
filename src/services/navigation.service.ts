import { NavigationContainerRef } from '@react-navigation/native';
import {RootStackParamList} from "~/navigation/navigation.type";



class NavigationService {
    private navigationRef: NavigationContainerRef<RootStackParamList> | null = null;

    setNavigationRef(ref: NavigationContainerRef<RootStackParamList>) {
        this.navigationRef = ref;
    }

    navigate<RouteName extends keyof RootStackParamList>(
        routeName: RouteName,
        params?: RootStackParamList[RouteName]
    ) {
        if (this.navigationRef) {
            if (params) {
                // @ts-expect-error params is optional
                this.navigationRef.navigate(routeName, params);
            } else {
                this.navigationRef.navigate(routeName);
            }
        }
    }

    setIndex(index: number) {
        if (this.navigationRef) {
            this.navigationRef.resetRoot({
                index,
                routes: [{ name: 'HomeScreen' }],
            });
        }
    }


}

const navigationService = new NavigationService();

export default navigationService;