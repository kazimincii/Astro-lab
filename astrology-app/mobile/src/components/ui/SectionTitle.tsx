import React, { ReactNode } from 'react';
import { Text, TextProps } from 'react-native';
import clsx from 'clsx';

type SectionTitleProps = TextProps & {
  children: ReactNode;
  className?: string;
};

export function SectionTitle({ children, style, ...rest }: SectionTitleProps) {
  return (
    <Text
      {...rest}
      // @ts-expect-error className provided by NativeWind runtime
      className={clsx('text-xs uppercase tracking-[1px] text-slate-400', rest.className)}
      style={style}
    >
      {children}
    </Text>
  );
}
