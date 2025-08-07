import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { OnboardingRoutes } from "./onboardingNavigator";
import { registerForPhotoLibraryAccessAsync } from "../photoLibraryRegistery";
import { OnboardingConfigParams, OnboardingTemplateLayout } from "./OnboardingTemplateLayout";

type GalleryScreenNavigationProp = NativeStackNavigationProp<
    OnboardingRoutes,
    "Gallery"
>;

export default function GalleryScreen() {
    const navigation = useNavigation<GalleryScreenNavigationProp>();

    const moveToNextPage = () => {
        navigation.replace("Notifications");
    }

    const onPress = async () => {
        await registerForPhotoLibraryAccessAsync();
        moveToNextPage();
    };

    const params: OnboardingConfigParams = {
        title: "OnBoarding.galleryTitle",
        content: "OnBoarding.galleryContent",
        buttonOneText: "Common.accept",
        buttonOnePressCallback: onPress,
        buttonTwoText: "Common.optOut",
        buttonTwoPressCallback: moveToNextPage
    };

    return OnboardingTemplateLayout(params);
}
