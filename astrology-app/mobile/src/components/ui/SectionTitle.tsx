import React from 'react';
import { Text, TextProps } from 'react-native';
import clsx from 'clsx';

export function SectionTitle({ children, style, ...rest }: TextProps) {
  return (
    <Text
      {...rest}
      className={clsx('text-xs uppercase tracking-[1px] text-slate-400', rest.className)}
      style={style}
    >
      {children}
    </Text>
  );
}
