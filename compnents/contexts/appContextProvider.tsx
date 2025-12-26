import { combineComponents } from "../combineComponents";

import SitesArrayContextProvider from "./sitesArrayContext";
import SelectedShopContextProvider from "./selectedShopContext";
import SearchTextContextProvider from "./searchTextContext";
import AnchorPhotosContextProvider from "./anchorPhotosContext";
import AnimalMultiSelectContextProvider from "./animalMultiSelectContext";
import SelectedDiveSiteContextProvider from "./selectedDiveSiteContext";
import PictureContextProvider from "./pictureContext";
import SelectedPictureContextProvider from "./selectedPictureContext";
import SelectedProfileContextProvider from "./selectedProfileModalContext";
import SelectedPhotoContextProvider from "./selectedPhotoContext";
import EditModeContextProvider from "./editModeContext";
import EditsContextProvider from "./editsContext";
import SavedTranslateYContextProvider from "./savedTranslateYContext";
import SearchStatusContextProvider from "./searchStatusContext";

const providers = [
    SitesArrayContextProvider,
    SelectedShopContextProvider,
    SearchTextContextProvider,
    AnchorPhotosContextProvider,
    AnimalMultiSelectContextProvider,
    SelectedDiveSiteContextProvider,
    PictureContextProvider,
    SelectedPictureContextProvider,
    SelectedProfileContextProvider,
    SelectedPhotoContextProvider,
    SelectedPictureContextProvider,
    SelectedProfileContextProvider,
    SelectedPhotoContextProvider,
    EditModeContextProvider,
    EditsContextProvider,
    SavedTranslateYContextProvider,
    SearchStatusContextProvider,
];

export const AppContextProvider = combineComponents(...providers);