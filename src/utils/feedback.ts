import * as Haptics from 'expo-haptics';
import { toast } from 'sonner-native';

export enum HapticsType {
  SUCCESS = 'success',
  WARNING = 'warning',
  ERROR = 'error',
}

const HapticsTypeMap = {
    [HapticsType.SUCCESS]: Haptics.NotificationFeedbackType.Success,
    [HapticsType.WARNING]: Haptics.NotificationFeedbackType.Warning,
    [HapticsType.ERROR]: Haptics.NotificationFeedbackType.Error,
}

interface ToastProps {
    type: 'success' | 'error' | 'info';
    title: string;
    visibilityTime?: number;
    onHide?: () => void;
    onPress?: VoidFunction;
    position?: 'top-center' | 'bottom-center';
}

export function hapticFeedback(type: HapticsType) {
  Haptics.notificationAsync(HapticsTypeMap[type]);
}

export function showToast(props: ToastProps) {
 switch (props.type) {
   case 'success':
     return toast.success(props.title, {
       onDismiss: props.onHide,
       onPress: props.onPress,
       position: props.position,
       duration: props.visibilityTime
     })
   case 'info':
     return toast.info(props.title, {
       onDismiss: props.onHide,
       onPress: props.onPress,
     })
   case 'error':
     return toast.error(props.title, {
       onDismiss: props.onHide,
       onPress: props.onPress,
     })
 }
}