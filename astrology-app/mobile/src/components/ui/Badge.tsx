import React, { ReactNode } from 'react';
import { Text, View, ViewProps } from 'react-native';
import clsx from 'clsx';

type BadgeProps = ViewProps & {
  icon?: ReactNode;
  children: ReactNode;
};

export function Badge({ icon, children, style, ...rest }: BadgeProps) {
  return (
    <View
      {...rest}
      className={clsx(
        'flex-row items-center gap-2 rounded-full border border-[#2d2e3f] bg-white/5 px-3 py-2',
        rest.className,
      )}
      style={style}
    >
      {icon}
      <Text className="text-xs font-semibold text-white">{children}</Text>
    </View>
  );
}
