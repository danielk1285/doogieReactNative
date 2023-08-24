import {IOnBoardingScreen} from '@screens/AuthScreens/OnBoardingScreen/OnBoardingScreen.types';
import onboardingImage from '@assets/svg/onboarding.svg';

const slides: IOnBoardingScreen[] = [
  {
    id: '1',
    image: onboardingImage,
    title: 'Doogy Transfer',
    subtitle: 'The cheapest currency exchange, Guaranteed.',
  },
  {
    id: '2',
    image: onboardingImage,
    title: 'Doogy Transfer',
    subtitle: 'Simple fee structure, no small letters.',
  },
  {
    id: '3',
    image: onboardingImage,
    title: 'Doogy Transfer',
    subtitle: 'Safe and secure exchange.',
  },
  {
    id: '4',
    image: onboardingImage,
    title: 'Doogy Transfer',
    subtitle: 'Safe and secure exchange.',
  },
];

export default slides;
