import ActivityCardItem from '@components/ActivityCardItem/ActivityCardItem';
import KeyboardAwareView from '@layouts/KeyboardAwareView/KeyboardAwareView';
import {useRoute} from '@react-navigation/native';
import ActivityCard from '@sections/DashBoardSectons/ActivityCard/ActivityCard';
import {
  IActivity,
  IActivityCardItem,
} from '@sections/DashBoardSectons/ActivityCard/ActivityCard.types';
import asRoute from 'hoc/asRoute';
import {VStack} from 'native-base';
import React from 'react';
import {activityData} from './DashBoardScreen';

function MyActivityScreen() {
  // const activityList = useRoute().params as IActivity[];

  return (
    <KeyboardAwareView>
      <VStack bg="#fff" h="full">
        <ActivityCard
          // title="My activity"
          activityList={activityData}
        />
      </VStack>
    </KeyboardAwareView>
  );
}

const myActivityScreen = asRoute(MyActivityScreen, 'myActivityScreen', {
  title: 'My Activity',
});

export default myActivityScreen;
