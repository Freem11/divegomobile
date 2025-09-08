import { createNativeStackNavigator } from "@react-navigation/native-stack";

import { NavigationHeader } from "../compnents/reusables/navigationHeader/NavigationHeader";
import { NavigationButton } from "../compnents/reusables/navigationHeader/NavigationButton";
import SiteReviewCreatorScreen from "../compnents/screens/siteReviewCreator/SiteReviewCreatorScreen";
import MapPage from "../compnents/mapPage/mapPage";
import type {StackNavigationProp} from "@react-navigation/stack";

export type RootStackParamList = {
  Home: undefined;
  SiteReviewCreator: { selectedDiveSite: number; siteName?: string };
};

const Stack = createNativeStackNavigator<RootStackParamList, 'RootStack'>();
export type NavigationProp = StackNavigationProp<RootStackParamList>;

export function AppNavigator() {
  return (
    <Stack.Navigator
      id="RootStack"
      initialRouteName="Home"
      screenOptions={{
        headerShown: false,
        headerTintColor: '#000',
        headerStyle: { backgroundColor: '#fff' }
      }}
    >
      <Stack.Screen name={'Home'} component={MapPage} />
      <Stack.Screen
        name={'SiteReviewCreator'}
        component={SiteReviewCreatorScreen}
        options={({ route }) => ({
          headerShown: true,
          header: ({ navigation }) => (
            <NavigationHeader
              title={'Dive site review'}
              subtitle={route.params?.siteName}
              left={(
                <NavigationButton
                  onPress={() => navigation.goBack()}
                  iconName="close"
                />
              )}
            />
          )})}
      />
    </Stack.Navigator>
  );
}