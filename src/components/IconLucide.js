import React from 'react';
import * as icons from 'lucide-react-native';

export default function IconLucide({ name, color = 'black', size = 24 }) {
  const Icon = icons[name];
  if (!Icon) return null;
  return <Icon color={color} size={size} />;
}