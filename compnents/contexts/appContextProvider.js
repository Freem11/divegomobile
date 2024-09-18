import { combineComponents } from '../combineComponents';

import ZoomHelperContextProvider from './zoomHelperContext';
import TripDetailContextProvider from './tripDetailsContext';
import TripSitesContextProvider from './tripSitesContext';
import SitesArrayContextProvider from './sitesArrayContext';
import ShopModalContextProvider from './shopModalContext';
import SelectedShopContextProvider from './selectedShopContext';
import ModalSelectContextProvider from './modalSelectContext';
import ProfileModalContextProvider from './profileModalContext';
import PartnerModalContextProvider from './partnerAccountRequestModalContext';
import AreaPicsContextProvider from './areaPicsContext';
import SearchTextContextProvider from './searchTextContext';
import AnchorPhotosContextProvider from './anchorPhotosContext';
import ReverseContextProvider from './reverseContext';
import UserProfileContextProvider from './userProfileContext';
import MapHelperContextProvider from './mapHelperContext';
import TutorialLaunchPadContextProvider from './tutorialLaunchPadContext';
import TutorialResetContextProvider from './tutorialResetContext';
import TutorialContextProvider from './tutorialContext';
import ThirdTutorialModalContextProvider from './thirdTutorialModalContext';
import SecondTutorialModalContextProvider from './secondTutorialModalContext';
import TutorialModalContextProvider from './tutorialModalContext';
import HeatPointsContextProvider from './heatPointsContext';
import AnimalMultiSelectContextProvider from './animalMultiSelectContext';
import SelectedDiveSiteContextProvider from './selectedDiveSiteContext';
import PictureContextProvider from './pictureContext';
import SliderContextProvider from './sliderContext';
import AnimalSelectContextProvider from './animalSelectContext';
import DiveSpotContextProvider from './diveSpotContext';
import MapBoundariesContextProvider from './mapBoundariesContext';
import PinContextProvider from './staticPinContext';
import PictureAdderContextProvider from './picModalContext';
import PullTabContextProvider from './pullTabContext';
import CarrouselTilesContextProvider from './carrouselTilesContext';
import CommentsModalContextProvider from './commentsModalContext';
import SelectedPictureContextProvider from './selectedPictureContext';
import SelectedProfileContextProvider from './selectedProfileModalContext';
import PhotoBoxModalContextProvider from './photoBoxModalContext';
import SelectedPhotoContextProvider from './selectedPhotoContext';
import ActiveTutorialIDContextProvider from './activeTutorialIDContext';
import ActiveConfirmationIDContextProvider from './activeConfirmationIDContext';
import PreviousButtonIDContextProvider from './previousButtonIDContext';
import SmallModalContextProvider from './smallModalContext';
import FullScreenModalContextProvider from './fullScreenModalContext';
import ConfirmationModalContextProvider from './confirmationModalContext';
import ConfirmationTypeContextProvider from './confirmationTypeContext';
import MapConfigContextProvider from './mapConfigContext';
import ShopContextProvider from './shopContext';
import EditModeContextProvider from './editModeContext';
import ActiveScreenContextProvider from './activeScreenContext';
import LevelOneScreenContextProvider from './levelOneScreenContext';
import LevelTwoScreenContextProvider from './levelTwoScreenContext';

const providers = [
    MapConfigContextProvider,
    ZoomHelperContextProvider,
    TripDetailContextProvider,
    TripSitesContextProvider,
    SitesArrayContextProvider,
    ShopModalContextProvider,
    SelectedShopContextProvider,
    ModalSelectContextProvider,
    ProfileModalContextProvider,
    PartnerModalContextProvider,
    AreaPicsContextProvider,
    SearchTextContextProvider,
    AnchorPhotosContextProvider,
    ReverseContextProvider,
    UserProfileContextProvider,
    MapHelperContextProvider,
    TutorialLaunchPadContextProvider,
    TutorialResetContextProvider,
    TutorialContextProvider,
    ThirdTutorialModalContextProvider,
    SecondTutorialModalContextProvider,
    TutorialModalContextProvider,
    HeatPointsContextProvider,
    AnimalMultiSelectContextProvider,
    SelectedDiveSiteContextProvider,
    PictureContextProvider,
    SliderContextProvider,
    AnimalSelectContextProvider,
    DiveSpotContextProvider,
    MapBoundariesContextProvider,
    PinContextProvider,
    PictureAdderContextProvider,
    PullTabContextProvider,
    CarrouselTilesContextProvider,
    CommentsModalContextProvider,
    SelectedPictureContextProvider,
    SelectedProfileContextProvider,
    PhotoBoxModalContextProvider,
    SelectedPhotoContextProvider,
    ActiveTutorialIDContextProvider,
    PreviousButtonIDContextProvider,
    ActiveConfirmationIDContextProvider,
    SmallModalContextProvider,
    FullScreenModalContextProvider,
    ConfirmationModalContextProvider,
    ConfirmationTypeContextProvider,
    ShopContextProvider,
    EditModeContextProvider,
    ActiveScreenContextProvider,
    LevelOneScreenContextProvider,
    LevelTwoScreenContextProvider
]

export const AppContextProvider = combineComponents(...providers);