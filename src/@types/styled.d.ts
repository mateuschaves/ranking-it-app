import 'styled-components/native'
import Colors from '~/theme/colors';

declare module 'styled-components/native' {
    export interface DefaultTheme {
        colors: typeof Colors
    }
}