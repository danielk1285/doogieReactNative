import CustomLoginButton from '@components/CustomLoginButton/CustomLoginButton';
import {VStack} from 'native-base';
import React from 'react';

import auth from '@react-native-firebase/auth';
import {GoogleSignin} from '@react-native-google-signin/google-signin';
import {AccessToken, LoginManager} from 'react-native-fbsdk-next';
import {appleAuth} from '@invertase/react-native-apple-authentication';

export default function SocialSignInBtns() {
  async function onFacebookButtonPress() {
    try {
      // Attempt login with permissions
      const result = await LoginManager.logInWithPermissions([
        'public_profile',
        'email',
      ]);

      if (result.isCancelled) {
        // throw 'User cancelled the login process';
      }

      // Once signed in, get the users AccesToken
      const data = await AccessToken.getCurrentAccessToken();

      if (!data) {
        // throw 'Something went wrong obtaining access token';
      }

      // Create a Firebase credential with the AccessToken
      const facebookCredential = auth.FacebookAuthProvider.credential(
        data.accessToken,
      );

      // Sign-in the user with the credential
      auth().signInWithCredential(facebookCredential);
    } catch (error) {
      alert('Error' + '' + error?.message);
    }
  }

  async function onGoogleButtonPress() {
    try {
      // Check if your device supports Google Play
      await GoogleSignin.hasPlayServices({showPlayServicesUpdateDialog: true});
      // Get the users ID token
      const {idToken} = await GoogleSignin.signIn();

      // Create a Google credential with the token
      const googleCredential = auth.GoogleAuthProvider.credential(idToken);

      console.log(googleCredential);
      // Sign-in the user with the credential
      auth().signInWithCredential(googleCredential);
    } catch (error) {
      // alert('Error' + '' + error?.message);
      console.log(error);
    }
  }

  const onAppleButtonPress = async () => {
    try {
      // Start the sign-in request
      const appleAuthRequestResponse = await appleAuth.performRequest({
        requestedOperation: appleAuth.Operation.LOGIN,
        requestedScopes: [appleAuth.Scope.EMAIL, appleAuth.Scope.FULL_NAME],
      });

      // Ensure Apple returned a user identityToken
      if (!appleAuthRequestResponse.identityToken) {
        throw new Error('Apple Sign-In failed - no identify token returned');
      }

      // Create a Firebase credential from the response
      const {identityToken, nonce} = appleAuthRequestResponse;
      const appleCredential = auth.AppleAuthProvider.credential(
        identityToken,
        nonce,
      );

      // Sign the user in with the credential
      return auth().signInWithCredential(appleCredential);
    } catch (error) {
      console.log(error);
    }
  };

  const socialButtons = [
    {
      name: 'apple',
      title: 'Continue with Apple',
      onPress: onAppleButtonPress,
    },
    {
      name: 'google',
      title: 'Continue with Google',
      onPress: onGoogleButtonPress,
    },
    {
      name: 'facebook',
      title: 'Continue with Facebook',
      onPress: onFacebookButtonPress,
    },
  ];

  const buttons = socialButtons.map(button => (
    <CustomLoginButton
      key={button.name}
      name={button.name}
      title={button.title}
      onPress={button.onPress}
    />
  ));

  return <VStack space={4}>{buttons}</VStack>;
}
