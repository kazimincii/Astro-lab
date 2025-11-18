import React, { ReactNode } from 'react';
import { View, ViewProps } from 'react-native';
import clsx from 'clsx';

type CardProps = ViewProps & {
  children: ReactNode;
  padded?: boolean;
  borderless?: boolean;
};

export function Card({ children, padded = true, borderless = false, style, ...rest }: CardProps) {
  return (
    <View
      {...rest}
      className={clsx(
        'rounded-2xl bg-[#1a1b2e]',
        !borderless && 'border border-[#24243a]',
        padded && 'p-5',
        rest.className,
      )}
      style={style}
    >
      {children}
    </View>
  );
}
