import { combineComponents } from "../combineComponents";

import SitesArrayContextProvider from "./sitesArrayContext";
import SelectedShopContextProvider from "./selectedShopContext";
import ModalSelectContextProvider from "./modalSelectContext";
import AreaPicsContextProvider from "./areaPicsContext";
import SearchTextContextProvider from "./searchTextContext";
import AnchorPhotosContextProvider from "./anchorPhotosContext";
import AnimalMultiSelectContextProvider from "./animalMultiSelectContext";
import SelectedDiveSiteContextProvider from "./selectedDiveSiteContext";
import PictureContextProvider from "./pictureContext";
import AnimalSelectContextProvider from "./animalSelectContext";
import SelectedPictureContextProvider from "./selectedPictureContext";
import SelectedProfileContextProvider from "./selectedProfileModalContext";
import SelectedPhotoContextProvider from "./selectedPhotoContext";
import ShopContextProvider from "./shopContext";
import EditModeContextProvider from "./editModeContext";
import EditsContextProvider from "./editsContext";
import SavedTranslateYContextProvider from "./savedTranslateYContext";
import SearchStatusContextProvider from "./searchStatusContext";

const providers = [
    SitesArrayContextProvider,
    SelectedShopContextProvider,
    ModalSelectContextProvider,
    AreaPicsContextProvider,
    SearchTextContextProvider,
    AnchorPhotosContextProvider,
    AnimalMultiSelectContextProvider,
    SelectedDiveSiteContextProvider,
    PictureContextProvider,
    AnimalSelectContextProvider,
    SelectedPictureContextProvider,
    SelectedProfileContextProvider,
    SelectedPhotoContextProvider,
    ShopContextProvider,
    EditModeContextProvider,
    EditsContextProvider,
    SavedTranslateYContextProvider,
    SearchStatusContextProvider,
];

export const AppContextProvider = combineComponents(...providers);