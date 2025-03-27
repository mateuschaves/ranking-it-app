import Colors from "./colors";

const theme = {
    colors: Colors,
    padding: {
        sm: 10,
        md: 20,
        lg: 30,
        xl: 40,
    },
    margin: {
        sm: 10,
        md: 20,
        lg: 30,
        xl: 40,
    },
    borderRadius: {
        sm: 5,
        md: 10,
        lg: 15,
        xl: 20,
    },
    text: {
        sm: 12,
        md: 14,
        lg: 18,
        xl: 24,
    },
    weights: {
        sm: '200',
        md: '400',
        lg: '700',
    },
    space: {
        sm: 5,
        md: 10,
        lg: 15,
        xl: 20,
    },
} as const;

export default theme;