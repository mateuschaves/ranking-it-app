import Reactotron, {
    networking,
    trackGlobalErrors,
} from 'reactotron-react-native';

import AsyncStorage from '@react-native-async-storage/async-storage';

if (__DEV__) {
    const tron = Reactotron.setAsyncStorageHandler(AsyncStorage)
        .configure({host: '192.168.15.74'})
        .useReactNative()
        // @ts-ignore
        .use(networking())
        // @ts-ignore
        .use(trackGlobalErrors())
        .connect();
    tron.clear();

    // @ts-ignore
    console.tron = tron;
}