import React, { useEffect, useRef, useState } from 'react';
import { View, Text, Animated, TouchableOpacity, Dimensions } from 'react-native';
import { X, CheckCircle, AlertCircle, Info } from 'lucide-react-native';
import { useTheme } from '../../theme/useTheme';

const TOAST_DURATION = 4000;
const { width } = Dimensions.get('window');

const ToastManager = {
  toast: null,
  show({ type = 'info', text1, text2 }) {
    if (this.toast) {
      this.toast.show({ type, text1, text2 });
    }
  }
};

const Toast = () => {
  const [visible, setVisible] = useState(false);
  const [message, setMessage] = useState({ type: 'info', text1: '', text2: '' });
  const translateY = useRef(new Animated.Value(-100)).current;
  const opacity = useRef(new Animated.Value(0)).current;
  const scale = useRef(new Animated.Value(0.8)).current;
  const { isDarkMode } = useTheme();

  useEffect(() => {
    ToastManager.toast = {
      show: (message) => {
        setMessage(message);
        setVisible(true);
      }
    };
    return () => {
      ToastManager.toast = null;
    };
  }, []);

  useEffect(() => {
    if (visible) {
      Animated.parallel([
        Animated.spring(translateY, {
          toValue: 0,
          useNativeDriver: true,
          bounciness: 8,
          speed: 14
        }),
        Animated.timing(opacity, {
          toValue: 1,
          duration: 200,
          useNativeDriver: true
        }),
        Animated.spring(scale, {
          toValue: 1,
          useNativeDriver: true,
          bounciness: 4,
          speed: 14
        })
      ]).start();

      const timer = setTimeout(hideToast, TOAST_DURATION);
      return () => clearTimeout(timer);
    }
  }, [visible]);

  const hideToast = () => {
    Animated.parallel([
      Animated.timing(translateY, {
        toValue: 100,
        duration: 200,
        useNativeDriver: true
      }),
      Animated.timing(opacity, {
        toValue: 0,
        duration: 150,
        useNativeDriver: true
      }),
      Animated.timing(scale, {
        toValue: 0.8,
        duration: 200,
        useNativeDriver: true
      })
    ]).start(() => setVisible(false));
  };

  const getToastStyle = () => {
    const baseStyle = isDarkMode 
      ? 'border-[0.5px] bg-opacity-80'
      : 'border-[0.5px] bg-opacity-90';

    switch (message.type) {
      case 'success':
        return `${baseStyle} ${isDarkMode 
          ? 'bg-green-900 border-green-400/30' 
          : 'bg-green-50 border-green-200/50'}`;
      case 'error':
        return `${baseStyle} ${isDarkMode 
          ? 'bg-red-900 border-red-400/30' 
          : 'bg-red-50 border-red-200/50'}`;
      case 'warning':
        return `${baseStyle} ${isDarkMode 
          ? 'bg-yellow-900 border-yellow-400/30' 
          : 'bg-yellow-50 border-yellow-200/50'}`;
      default:
        return `${baseStyle} ${isDarkMode 
          ? 'bg-blue-900 border-blue-400/30' 
          : 'bg-blue-50 border-blue-200/50'}`;
    }
  };

  const getIconColor = () => {
    const colors = {
      success: isDarkMode ? '#86efac' : '#16a34a',
      error: isDarkMode ? '#fca5a5' : '#dc2626',
      warning: isDarkMode ? '#fcd34d' : '#d97706',
      info: isDarkMode ? '#93c5fd' : '#2563eb'
    };
    return colors[message.type] || colors.info;
  };

  const getTextColor = () => {
    return isDarkMode ? 'text-white' : 'text-gray-800';
  };

  const getIcon = () => {
    const iconColor = getIconColor();
    const iconSize = 24;
    
    switch (message.type) {
      case 'success':
        return <CheckCircle size={iconSize} color={iconColor} />;
      case 'error':
        return <AlertCircle size={iconSize} color={iconColor} />;
      case 'warning':
        return <AlertCircle size={iconSize} color={iconColor} />;
      default:
        return <Info size={iconSize} color={iconColor} />;
    }
  };

  if (!visible) return null;

  return (
    <Animated.View 
      className="absolute bottom-12 z-50 px-4 w-full"
      style={{
        transform: [{ translateY }, { scale }],
        opacity,
      }}
    >
      <View 
        className={`flex-row items-center p-4 rounded-2xl shadow-lg ${getToastStyle()}`}
        style={{
          shadowColor: isDarkMode ? 'rgba(0,0,0,0.5)' : 'rgba(0,0,0,0.1)',
          shadowOffset: { width: 0, height: 4 },
          shadowRadius: 12,
          elevation: 5,
        }}
      >
        <View className="mr-3">
          {getIcon()}
        </View>
        <View className="flex-1">
          <Text className={`font-semibold text-base ${getTextColor()}`}>
            {message.text1}
          </Text>
          {message.text2 && (
            <Text className={`text-sm mt-0.5 ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
              {message.text2}
            </Text>
          )}
        </View>
        <TouchableOpacity 
          onPress={hideToast} 
          className={`ml-2 p-2 rounded-full ${isDarkMode ? 'bg-dark-background' : 'bg-light-background50'}`}
        >
          <X size={16} color={isDarkMode ? '#fff' : '#374151'} />
        </TouchableOpacity>
      </View>
    </Animated.View>
  );
};

export { Toast, ToastManager };