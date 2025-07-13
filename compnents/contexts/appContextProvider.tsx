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
import ActiveConfirmationIDContextProvider from './activeConfirmationIDContext';
import FullScreenModalContextProvider from './fullScreenModalContext';
import ConfirmationModalContextProvider from './confirmationModalContext';
import ConfirmationTypeContextProvider from './confirmationTypeContext';
import ShopContextProvider from './shopContext';
import EditModeContextProvider from './editModeContext';
import LevelOneScreenContextProvider from './levelOneScreenContext';
import LevelTwoScreenContextProvider from "./levelTwoScreenContext";
import EditsContextProvider from './editsContext';
import SavedTranslateYContextProvider from './savedTranslateYContext';

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
    ActiveConfirmationIDContextProvider,
    FullScreenModalContextProvider,
    ConfirmationModalContextProvider,
    ConfirmationTypeContextProvider,
    ShopContextProvider,
    EditModeContextProvider,
    LevelOneScreenContextProvider,
    LevelTwoScreenContextProvider,
    EditsContextProvider,
    SavedTranslateYContextProvider,
]

export const AppContextProvider = combineComponents(...providers);