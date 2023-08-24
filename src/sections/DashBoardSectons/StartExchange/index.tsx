import SelectCurrecySheet from '@actionSheets/SelectCurrecySheet';
import GradientButton from '@components/GradientButton';
import SwapBtn from '@components/SwapBtn/SwapBtn';
import useToggle from '@hooks/useToggle';
import CurrencyExchangeCard from '@sections/DashBoardSectons/CurrencyExchangeCard/CurrencyExchangeCard';
import colors from '@theme/colors';
import {useFormik} from 'formik';
import {Pressable, Skeleton, Text, VStack} from 'native-base';
import React from 'react';
import Entopy from 'react-native-vector-icons/Entypo';
import {Alert} from 'react-native';

import useNavigate from '@hooks/useNavigate';
import {useNavigation} from '@react-navigation/native';
import {
  incrementNumberOfExpands,
  selectHasExpandedExchange,
  selectHasViewedTutorials,
  selectNumberOfExpands,
  setHasExpandedExchange,
  setHasViewedTutorials,
} from '@store/features/ui';
import {ICurrencyValue} from '@typedef/common.types';
import {useDispatch, useSelector} from 'react-redux';
import * as Yup from 'yup';
import {useGetConversionRatesQuery} from '../../../store/apis';
import removeTrailingZero from '@utils/removeTrailingZero';
import {SheetManager} from 'react-native-actions-sheet';
import {useLazyHasSufficientFundsQuery} from '@store/apis/walletsApi';
import LoaderModal from '@layouts/LoaderModal.tsx/LoaderModal';

export const activityData = [
  {
    id: 1,
    status: 'Approving',
    date: new Date(),
    icon: 'moneySend',
    amount: 'Sent 32,500 ₪',
  },
  {
    id: 2,
    status: 'Transfer Complete',
    date: new Date(2022),
    icon: 'moneyExchange',
    amount: '$ 10,000',
  },
  {
    id: 3,
    status: 'You Exchanged',
    date: new Date(),
    icon: 'moneyExchange',
    amount: '$ 10,000',
  },
  {
    id: 4,
    status: 'Approving',
    date: new Date(),
    icon: 'moneySend',
    amount: 'Sent 32,500 ₪',
  },
  {
    id: 5,
    status: 'Transfer Complete',
    date: new Date(2022),
    icon: 'moneyExchange',
    amount: '$ 10,000',
  },
  {
    id: 6,
    status: 'You Exchanged',
    date: new Date(),
    icon: 'moneyExchange',
    amount: '$ 10,000',
  },
];

interface IInitialValues {
  firstCurrency: string;
  secondCurrency: string;
}

const StartExchange = () => {
  const [isCollapsOpen, toggleCollaps, setToogle] = useToggle(true);
  const hasViewedTutorial = useSelector(selectHasViewedTutorials);
  const hasExpandedExchange = useSelector(selectHasExpandedExchange);

  const [checkHasSufficientFund, checkHasSufficientFundRes] =
    useLazyHasSufficientFundsQuery();

  const dispatch = useDispatch();

  const {data, isLoading} = useGetConversionRatesQuery(undefined);

  const navigate = useNavigate();

  const [isFirstOpen, toggleFirstOpen] = useToggle(false);
  const [isSecondOpen, toggleSecondOpen] = useToggle(false);

  const [firstCurrency, setFirstCurrency] = React.useState<
    ICurrencyValue | undefined
  >();
  const [secondCurrency, setSecondCurrency] = React.useState<
    ICurrencyValue | undefined
  >();

  const validationSchema = Yup.object().shape({
    firstCurrency: Yup.number()
      .typeError('Currency must be a number')
      .required('Currency is required')
      .min(1, 'Currency must be greater than 0'),
    secondCurrency: Yup.number()
      .typeError('Currency must be a number')
      .required('Currency is required')
      .min(1, 'Currency must be greater than 0'),
  });

  const initialValues: IInitialValues = {
    firstCurrency: '',
    secondCurrency: '',
  };

  const formik = useFormik({
    initialValues,
    onSubmit: async value => {
      const transferData: IExchangeRequest = {
        currencyFrom: firstCurrency?.currencyCode as any,
        currencyTo: secondCurrency?.currencyCode as any,
        amountToSend: Number(value.firstCurrency),
        amountConverted: Number(value.secondCurrency),
        amountReceived: Number(value.secondCurrency),
        action: 'Exchange',
      };
      const hasSufficientFund = await checkHasSufficientFund({
        fromCurrency: firstCurrency?.currencyCode as any,
        fromAmount: Number(value.firstCurrency),
      }).unwrap();

      console.log('hasSufficientFund', hasSufficientFund);

      if (hasSufficientFund) {
        if (hasViewedTutorial) {
          navigate('exchangeOptionScreen', transferData);
          dispatch(setHasViewedTutorials(true));
        } else {
          navigate('transferSourceScreen', {
            type: 'exchange',
            transferData,
          });
        }
      } else {
        Alert.alert(
          'Insufficient Funds',
          'You do not have sufficient funds to complete this transaction',
        );
      }
    },
    validationSchema,
  });

  const {values, errors, touched, setFieldValue, handleSubmit} = formik;

  const calculateCurrency = React.useCallback(
    (value: string, nextCurrency: string) => {
      let secondCurrencyValue = Number(value) / nextCurrency;
      return secondCurrencyValue.toFixed(2) + '';
    },
    [],
  );

  const onFirstCurrencyChange = React.useCallback(
    (value: string) => {
      if (secondCurrency?.currencyCode && firstCurrency?.currencyCode) {
        const secondCurrencyConversionRates =
          secondCurrency?.conversionRates[
            firstCurrency?.currencyCode?.toLowerCase()
          ];

        const secondCurrencyValue = calculateCurrency(
          value,
          secondCurrencyConversionRates,
        );

        setFieldValue(
          'secondCurrency',
          removeTrailingZero(secondCurrencyValue),
        );
      }

      setFieldValue('firstCurrency', removeTrailingZero(value));
    },
    [firstCurrency, secondCurrency, setFieldValue, calculateCurrency],
  );

  const onSecondCurrencyChange = React.useCallback(
    (value: string) => {
      if (secondCurrency?.currencyCode && firstCurrency?.currencyCode) {
        const firstCurrencyConversionRates =
          firstCurrency?.conversionRates[
            secondCurrency?.currencyCode?.toLowerCase()
          ];

        const firstCurrencyValue = calculateCurrency(
          value,
          firstCurrencyConversionRates,
        );

        setFieldValue('firstCurrency', removeTrailingZero(firstCurrencyValue));
      }

      setFieldValue('secondCurrency', removeTrailingZero(value));
    },

    [firstCurrency, secondCurrency, setFieldValue, calculateCurrency],
  );

  React.useEffect(() => {
    if (data) {
      const fstCurrency = data.currencies.find(
        item => item.currencyCode === 'USD',
      );

      const sndCurrency = data.currencies.find(
        item => item.currencyCode === 'ILS',
      );

      const secondValue = calculateCurrency(
        50000 + '',
        sndCurrency?.conversionRates[fstCurrency?.currencyCode?.toLowerCase()],
      );

      const firstValue = calculateCurrency(
        secondValue.toString(),
        fstCurrency?.conversionRates[sndCurrency?.currencyCode?.toLowerCase()],
      );

      setFieldValue('firstCurrency', removeTrailingZero(firstValue));

      setFieldValue('secondCurrency', removeTrailingZero(secondValue));

      setFirstCurrency(fstCurrency);

      setSecondCurrency(sndCurrency);
    }
  }, [data, setFieldValue, calculateCurrency]);

  const switchCurrency = () => {
    const firstCr = firstCurrency;
    const secondCr = secondCurrency;

    const firstCurrencyValue = formik.values.firstCurrency;
    const secondCurrencyValue = formik.values.secondCurrency;

    console.log({firstCr, secondCr});

    setSecondCurrency(firstCr);
    setFirstCurrency(secondCr);
    formik.setFieldValue('firstCurrency', secondCurrencyValue);
    formik.setFieldValue('secondCurrency', firstCurrencyValue);
  };

  const handleExpand = () => {
    if (hasExpandedExchange) {
      dispatch(setHasExpandedExchange(false));
    }
    toggleCollaps();
  };

  return (
    <VStack px={4} mt="-40px">
      <VStack bg="white" borderRadius="8px" px="4" minH={'50px'}>
        {!isLoading ? (
          <Pressable
            onPress={handleExpand}
            py="4"
            flexDirection="row"
            justifyContent="space-between">
            <Skeleton.Text
              isLoaded={!isLoading}
              startColor="#ffffff"
              endColor="#ffffff"
              lines={1}>
              <Text color={colors.black} variant="h2">
                Start a new exchange
              </Text>
            </Skeleton.Text>

            <Entopy
              name={isCollapsOpen ? 'chevron-up' : 'chevron-down'}
              size={24}
              color={'black'}
            />
          </Pressable>
        ) : null}

        {isCollapsOpen && !isLoading ? (
          <VStack bg="#ffffff" pb="10px" borderBottomRadius="8px">
            <VStack space={6}>
              <CurrencyExchangeCard
                borderTopRadius={0}
                onChangeText={onFirstCurrencyChange}
                flag={firstCurrency?.flag}
                currency={`${firstCurrency?.currencySymbol} (${firstCurrency?.currencyCode})`}
                value={values.firstCurrency}
                handleCurrency={() => {}}
                onPress={() => {
                  SheetManager.show('firstSheet');
                }}
                error={errors.firstCurrency}
                touched={touched.firstCurrency}
                currencySymbol={firstCurrency?.currencySymbol}
              />
              <SwapBtn onPress={switchCurrency} />
              <CurrencyExchangeCard
                currencySymbol={firstCurrency?.currencySymbol}
                subTitle="I am sending"
                onChangeText={onSecondCurrencyChange}
                value={values.secondCurrency}
                flag={secondCurrency?.flag}
                currency={
                  `${secondCurrency?.currencySymbol} (${secondCurrency?.currencyCode})` ||
                  ''
                }
                handleCurrency={() => {
                  console.log('second currency');
                }}
                onPress={() => {
                  SheetManager.show('secondSheet');
                }}
                error={errors.secondCurrency}
                touched={touched.secondCurrency}
              />
            </VStack>
            <Text textAlign={'center'}>
              1 {firstCurrency?.currencyCode} ={' '}
              {secondCurrency?.conversionRates[
                firstCurrency?.currencyCode?.toLowerCase()
              ]?.toFixed(2)}{' '}
              {secondCurrency?.currencyCode}
            </Text>
            <GradientButton onPress={handleSubmit} mt={7}>
              Start Exchange
            </GradientButton>
          </VStack>
        ) : null}
      </VStack>

      <SelectCurrecySheet
        id="firstSheet"
        currencies={data?.currencies?.filter(
          item =>
            item.currencyCode !== firstCurrency?.currencyCode &&
            item.currencyCode !== secondCurrency?.currencyCode,
        )}
        onSelectCurrency={(currency: ICurrencyValue) => {
          toggleFirstOpen();

          // take the current value of the first currency
          const currentValue = formik.values.firstCurrency;

          // find the conversion rate of the second currency from the currency

          const conversionRate =
            secondCurrency?.conversionRates[
              currency?.currencyCode?.toLowerCase()
            ];

          // calculate the value of the second currency from the first currency

          const secondValue = calculateCurrency(currentValue, conversionRate);

          setFieldValue('secondCurrency', secondValue.toString());
          setFirstCurrency(currency);
          SheetManager.hide('firstSheet');
        }}
        isOpen={isFirstOpen}
        onClose={toggleFirstOpen}
      />

      <SelectCurrecySheet
        id="secondSheet"
        currencies={data?.currencies?.filter(
          item =>
            item.currencyCode !== secondCurrency?.currencyCode &&
            item.currencyCode !== firstCurrency?.currencyCode,
        )}
        onSelectCurrency={(currency: ICurrencyValue) => {
          toggleSecondOpen();
          // take the current value of the second currency
          const currentValue = formik.values.secondCurrency;

          // find the conversion rate of the first currency from the currency

          const conversionRate =
            firstCurrency?.conversionRates[
              currency?.currencyCode?.toLowerCase()
            ];

          // calculate the value of the first currency from the second currency

          const firstInputValue = calculateCurrency(
            currentValue,
            conversionRate,
          );

          setFieldValue('firstCurrency', firstInputValue);
          setSecondCurrency(currency);
          SheetManager.hide('secondSheet');
        }}
        isOpen={isSecondOpen}
        onClose={toggleSecondOpen}
      />
      <LoaderModal
        isLoading={isLoading || checkHasSufficientFundRes.isLoading}
      />
    </VStack>
  );
};

export default StartExchange;
