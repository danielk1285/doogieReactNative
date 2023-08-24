import { PressableProps } from '../../types/native-base.types';
export interface IMyBalanceCard extends PressableProps {
    balanceType: string;
    amount: string;
}