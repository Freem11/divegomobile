import React from 'react';

import { combineComponents } from '../combineComponents';

import DiveSiteSearchModalContextProvider from './diveSiteSearchContext';
import MapSearchModalContextProvider from './mapSearchContext';
import ZoomHelperContextProvider from './zoomHelperContext';
import SitesArrayContextProvider from './sitesArrayContext';
import ShopModalContextProvider from './shopModalContext';
import SelectedShopContextProvider from './selectedShopContext';
import ModalSelectContextProvider from './modalSelectContext';
import ProfileModalContextProvider from './profileModalContext';
import DevelopmentModeContextProvider from './developementModeContext';
import AreaPicsContextProvider from './areaPicsContext';
import SearchTextContextProvider from './searchTextContext';
import ChapterContextProvider from './chapterContext';
import AnchorPhotosContextProvider from './anchorPhotosContext';
import ReverseContextProvider from './reverseContext';
import UserProfileContextProvider from './userProfileContext';
import MapHelperContextProvider from './mapHelperContext';
import TutorialLaunchPadContextProvider from './tutorialLaunchPadContext';
import AnchorModalContextProvider from './anchorModalContext';
import TutorialResetContextProvider from './tutorialResetContext';
import TutorialContextProvider from './tutorialContext';
import Iterator3ContextProvider from './iterrator3Context';
import Iterator2ContextProvider from './iterrator2Context';
import IteratorContextProvider from './iterratorContext';
import ThirdTutorialModalContextProvider from './thirdTutorialModalContext';
import SecondTutorialModalContextProvider from './secondTutorialModalContext';
import TutorialModalContextProvider from './tutorialModalContext';
import HeatPointsContextProvider from './heatPointsContext';
import AnimalMultiSelectContextProvider from './animalMultiSelectContext';
import SettingsContextProvider from './gearModalContext';
import SelectedDiveSiteContextProvider from './selectedDiveSiteContext';
import PictureContextProvider from './pictureContext';
import SliderContextProvider from './sliderContext';
import AnimalSelectContextProvider from './animalSelectContext';
import DiveSpotContextProvider from './diveSpotContext';
import MinorContextProvider from './minorContext';
import MasterContextProvider from './masterContext';
import MapBoundariesContextProvider from './mapBoundariesContext';
import PinContextProvider from './staticPinContext';
import PictureAdderContextProvider from './picModalContext';
import DSAdderContextProvider from './DSModalContext';
import PullTabContextProvider from './pullTabContext';
import CarrouselTilesContextProvider from './carrouselTilesContext';
import CommentsModalContextProvider from './commentsModalContext';
import SelectedPictureContextProvider from './selectedPictureContext';

const providers = [
    DiveSiteSearchModalContextProvider,
    MapSearchModalContextProvider,
    ZoomHelperContextProvider,
    SitesArrayContextProvider,
    ShopModalContextProvider,
    SelectedShopContextProvider,
    ModalSelectContextProvider,
    ProfileModalContextProvider,
    DevelopmentModeContextProvider,
    AreaPicsContextProvider,
    SearchTextContextProvider,
    ChapterContextProvider,
    AnchorPhotosContextProvider,
    ReverseContextProvider,
    UserProfileContextProvider,
    MapHelperContextProvider,
    TutorialLaunchPadContextProvider,
    AnchorModalContextProvider,
    TutorialResetContextProvider,
    TutorialContextProvider,
    Iterator3ContextProvider,
    Iterator2ContextProvider,
    IteratorContextProvider,
    ThirdTutorialModalContextProvider,
    SecondTutorialModalContextProvider,
    TutorialModalContextProvider,
    HeatPointsContextProvider,
    AnimalMultiSelectContextProvider,
    SettingsContextProvider,
    SelectedDiveSiteContextProvider,
    PictureContextProvider,
    SliderContextProvider,
    AnimalSelectContextProvider,
    DiveSpotContextProvider,
    MinorContextProvider,
    MasterContextProvider,
    MapBoundariesContextProvider,
    PinContextProvider,
    PictureAdderContextProvider,
    DSAdderContextProvider,
    PullTabContextProvider,
    CarrouselTilesContextProvider,
    CommentsModalContextProvider,
    SelectedPictureContextProvider,
]

export const AppContextProvider = combineComponents(...providers);