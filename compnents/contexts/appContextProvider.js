import { combineComponents } from '../combineComponents';

import ZoomHelperContextProvider from './zoomHelperContext';
import TripDetailContextProvider from './tripDetailsContext';
import TripSitesContextProvider from './tripSitesContext';
import SitesArrayContextProvider from './sitesArrayContext';
import ShopModalContextProvider from './shopModalContext';
import SelectedShopContextProvider from './selectedShopContext';
import ModalSelectContextProvider from './modalSelectContext';
import ProfileModalContextProvider from './profileModalContext';
import AreaPicsContextProvider from './areaPicsContext';
import SearchTextContextProvider from './searchTextContext';
import AnchorPhotosContextProvider from './anchorPhotosContext';
import ReverseContextProvider from './reverseContext';
import UserProfileContextProvider from './userProfileContext';
import HeatPointsContextProvider from './heatPointsContext';
import AnimalMultiSelectContextProvider from './animalMultiSelectContext';
import SelectedDiveSiteContextProvider from './selectedDiveSiteContext';
import PictureContextProvider from './pictureContext';
import AnimalSelectContextProvider from './animalSelectContext';
import CommentsModalContextProvider from './commentsModalContext';
import SelectedPictureContextProvider from './selectedPictureContext';
import SelectedProfileContextProvider from './selectedProfileModalContext';
import PhotoBoxModalContextProvider from './photoBoxModalContext';
import SelectedPhotoContextProvider from './selectedPhotoContext';
import ActiveTutorialIDContextProvider from './activeTutorialIDContext';
import ActiveConfirmationIDContextProvider from './activeConfirmationIDContext';
import PreviousButtonIDContextProvider from './previousButtonIDContext';
import FullScreenModalContextProvider from './fullScreenModalContext';
import ConfirmationModalContextProvider from './confirmationModalContext';
import ConfirmationTypeContextProvider from './confirmationTypeContext';
import ShopContextProvider from './shopContext';
import EditModeContextProvider from './editModeContext';
import ActiveScreenContextProvider from './activeScreenContext';
import LevelOneScreenContextProvider from './levelOneScreenContext';
import LevelTwoScreenContextProvider from './levelTwoScreenContext';
import EditsContextProvider from './editsContext';
import SavedTranslateYContextProvider from './savedTranslateYContext';

const providers = [
    ZoomHelperContextProvider,
    TripDetailContextProvider,
    TripSitesContextProvider,
    SitesArrayContextProvider,
    ShopModalContextProvider,
    SelectedShopContextProvider,
    ModalSelectContextProvider,
    ProfileModalContextProvider,
    AreaPicsContextProvider,
    SearchTextContextProvider,
    AnchorPhotosContextProvider,
    ReverseContextProvider,
    UserProfileContextProvider,
    HeatPointsContextProvider,
    AnimalMultiSelectContextProvider,
    SelectedDiveSiteContextProvider,
    PictureContextProvider,
    AnimalSelectContextProvider,
    CommentsModalContextProvider,
    SelectedPictureContextProvider,
    SelectedProfileContextProvider,
    PhotoBoxModalContextProvider,
    SelectedPhotoContextProvider,
    ActiveTutorialIDContextProvider,
    PreviousButtonIDContextProvider,
    ActiveConfirmationIDContextProvider,
    FullScreenModalContextProvider,
    ConfirmationModalContextProvider,
    ConfirmationTypeContextProvider,
    ShopContextProvider,
    EditModeContextProvider,
    ActiveScreenContextProvider,
    LevelOneScreenContextProvider,
    LevelTwoScreenContextProvider,
    EditsContextProvider,
    SavedTranslateYContextProvider,
]

export const AppContextProvider = combineComponents(...providers);