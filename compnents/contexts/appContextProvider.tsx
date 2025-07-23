import { combineComponents } from '../combineComponents';

import TripDetailContextProvider from './tripDetailsContext';
import TripSitesContextProvider from './tripSitesContext';
import SitesArrayContextProvider from './sitesArrayContext';
import SelectedShopContextProvider from './selectedShopContext';
import ModalSelectContextProvider from './modalSelectContext';
import ProfileModalContextProvider from './profileModalContext';
import AreaPicsContextProvider from './areaPicsContext';
import SearchTextContextProvider from './searchTextContext';
import AnchorPhotosContextProvider from './anchorPhotosContext';
import UserProfileContextProvider from './userProfileContext';
import AnimalMultiSelectContextProvider from './animalMultiSelectContext';
import SelectedDiveSiteContextProvider from './selectedDiveSiteContext';
import PictureContextProvider from './pictureContext';
import AnimalSelectContextProvider from './animalSelectContext';
import CommentsModalContextProvider from './commentsModalContext';
import SelectedPictureContextProvider from './selectedPictureContext';
import SelectedProfileContextProvider from './selectedProfileModalContext';
import SelectedPhotoContextProvider from './selectedPhotoContext';
import ActiveTutorialIDContextProvider from './activeTutorialIDContext';
import FullScreenModalContextProvider from './fullScreenModalContext';
import ShopContextProvider from './shopContext';
import EditModeContextProvider from './editModeContext';
import LevelOneScreenContextProvider from './levelOneScreenContext';
import LevelTwoScreenContextProvider from "./levelTwoScreenContext";
import LevelThreeScreenContextProvider from "./levelThreeScreenContext";
import EditsContextProvider from './editsContext';
import SavedTranslateYContextProvider from './savedTranslateYContext';
import SearchStatusContextProvider from "./searchStatusContext";

const providers = [
    TripDetailContextProvider,
    TripSitesContextProvider,
    SitesArrayContextProvider,
    SelectedShopContextProvider,
    ModalSelectContextProvider,
    ProfileModalContextProvider,
    AreaPicsContextProvider,
    SearchTextContextProvider,
    AnchorPhotosContextProvider,
    UserProfileContextProvider,
    AnimalMultiSelectContextProvider,
    SelectedDiveSiteContextProvider,
    PictureContextProvider,
    AnimalSelectContextProvider,
    CommentsModalContextProvider,
    SelectedPictureContextProvider,
    SelectedProfileContextProvider,
    SelectedPhotoContextProvider,
    ActiveTutorialIDContextProvider,
    FullScreenModalContextProvider,
    ShopContextProvider,
    EditModeContextProvider,
    LevelOneScreenContextProvider,
    LevelTwoScreenContextProvider,
    LevelThreeScreenContextProvider,
    EditsContextProvider,
    SavedTranslateYContextProvider,
    SearchStatusContextProvider,
]

export const AppContextProvider = combineComponents(...providers);