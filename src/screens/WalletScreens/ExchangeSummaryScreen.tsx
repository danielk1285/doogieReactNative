import {exchangeSummary} from '@appData/myWallet';
import GradientButton from '@components/GradientButton';
import useNavigate from '@hooks/useNavigate';
import ExchangeSummaryCard from '@layouts/ExchangeSummaryCard/ExchangeSummaryCard';
import KeyboardAwareView from '@layouts/KeyboardAwareView/KeyboardAwareView';
import asRoute from 'hoc/asRoute';
import {VStack} from 'native-base';
import React from 'react';

function ExchangeSummaryScreen() {
  const navigate = useNavigate();

  const handleToContinue = () => {
    navigate('myWalletScreen');
  };
  return (
    <KeyboardAwareView>
      <VStack p="20px" space="20">
        <VStack bg="white" p="16px" borderRadius="8px">
          {exchangeSummary.map((exchangeSummary, index) => (
            <ExchangeSummaryCard
              key={index}
              exchangeSummary={exchangeSummary}
            />
          ))}
        </VStack>
        <GradientButton mt="20px" onPress={handleToContinue}>
          Continue
        </GradientButton>
      </VStack>
    </KeyboardAwareView>
  );
}

const exchangeSummaryScreen = asRoute(
  ExchangeSummaryScreen,
  'exchangeSummaryScreen',
  {
    title: 'Summary',
  },
);

export default exchangeSummaryScreen;
