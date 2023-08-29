# DiveGo (Mobile Version) 
Built with the dream of making every dive hold the chance for an unforgettable encounter with a sea creature 

# Built With
React-Native
Expo-Cli
Supabase (BAAS)
Netlify (hosting)
react-native-maps
react-native-reanimated
react-native-gesture-handler
use-supercluster
exifr

# Available at
Google Play Store: https://play.google.com/store/apps/details?id=com.DiveGo

!["Google Play QR"](https://github.com/Freem11/divego-mobile/blob/master/frontend/DiveGoMobile/compnents/png/GooglePlay.png)

Apple App Store: https://apps.apple.com/ca/app/divego/id6443680026

!["Apple App Store QR"](https://github.com/Freem11/divego-mobile/blob/master/frontend/DiveGoMobile/compnents/png/AppleAppStore.png)


# Current Features:

Map Interface that Displays Anchor Icons to represent dive sites and heat map points to show location and number of sea creature sightings 

Map will load to user's/device current location (once permission is granted) if not granted it will load to BC Canada as default

Icon Clustering to maintain map performance when large amount of data are on screen.

Google Places API integration to allow users to jump the map to other places in the world by inputting a town/city name.

Dive Site search tool, list will auto filter to dive sites in the maps current view, upon selecting a dive site the map will pan and zoom to that dive site and place a yeloow indicator for 2 seconds to help users find it.

Animal Photo Carrousel that users can use to select which animals they would like the heatmap and dive sites to show. Photos diplayed will update as the map moves to show animals that have been sighted in the maps area.

Histogram showing chart that displays frequency of sightings by month of selected sea creature(s), chart will update as the map is moved.

Dive Site submission form with "I'm at the dive site" button that takes users current location to serve as dive site GPS location.

Photo Submission form, upload a photo if it contains a created date and/or GPS EXIF data it will be used as the date and lat/lng info.

Pin drop feature, for photos with no GPS EXIF data, place the draggable pin anywhere on the map and tap the "set pin" button to relay the pins GPS location as the sea creature sightings lat/lng coordinates. 

Dive site animal photo gallery, animal sightings within a pre-determined GPS radius are displayed when tapping on a specific dive site anchor icon.

Photo flagging feature allowing users to ID incorrectly identifued sea creature photos or to make copy write claims on submitted photos

Dive Site flagging feature allowing users to report incorrect dive site names or GPS locations

How to Guide, explains most features of the app for new users. 

Backend integration with Supabase 

# In Progress Features:

Login/Logout/Register system with persistent login (user stays logged in even after closing browser, unless they deliberately log out)

# Planned Features:

Automated photo validation using machine learning 
Automated animal ID from photo machine learning 


# ScreenShots
!["Screenshot of App"](https://github.com/Freem11/divego-mobile/blob/master/frontend/DiveGoMobile/compnents/png/Overview.png)
!["Screenshot of FABs"](https://github.com/Freem11/divego-mobile/blob/master/frontend/DiveGoMobile/compnents/png/OverviewMenu.png)
!["Screenshot of Dive Site Form"](https://github.com/Freem11/divego-mobile/blob/master/frontend/DiveGoMobile/compnents/png/DiveSiteNew.png)
!["Screenshot of Photo Upload Form"](https://github.com/Freem11/divego-mobile/blob/master/frontend/DiveGoMobile/compnents/png/PhotoSubmit.png)
!["Screenshot of Pin Drop"](https://github.com/Freem11/divego-mobile/blob/master/frontend/DiveGoMobile/compnents/png/PInDrop.PNG)
!["Screenshot of Site Photos"](https://github.com/Freem11/divego-mobile/blob/master/frontend/DiveGoMobile/compnents/png/DiveSitePhotos.png)
!["Screenshot of Site Photos"](https://github.com/Freem11/divego-mobile/blob/master/frontend/DiveGoMobile/compnents/png/DiveSiteSearch.png)
!["Screenshot of Site Photos"](https://github.com/Freem11/divego-mobile/blob/master/frontend/DiveGoMobile/compnents/png/PermissionLocation.png)
!["Screenshot of Site Photos"](https://github.com/Freem11/divego-mobile/blob/master/frontend/DiveGoMobile/compnents/png/PermissionPhotos.png)
!["Screenshot of Site Photos"](https://github.com/Freem11/divego-mobile/blob/master/frontend/DiveGoMobile/compnents/png/HowToGuide.png)
