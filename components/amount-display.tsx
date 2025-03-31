import * as React from 'react';
import { Text } from 'react-native';
import { cn } from '~/lib/utils';

export interface AmountDisplayProps {
  amount: number
  unit: string
}

export function AmountDisplay({
    amount, unit,
}: AmountDisplayProps): React.ReactElement {
    return (
        <Text className={cn(
            `text-xl font-semibold`,
            amount > 0 && `text-green-500`,
            amount < 0 && `text-red-500`
        )}
        >
            {amount > 0
                ? '＋'
                : '－'}
            {Math.abs(amount)}
            {' '}
            {unit}
        </Text>
    );
}

