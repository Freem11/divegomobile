import { StyleSheet } from 'react-native'
import { moderateScale } from 'react-native-size-matters'
import { colors, activeFonts } from '../../styles'

export const styles = StyleSheet.create({
  navigationButton: {
    width: moderateScale(40),
    height: moderateScale(40),
    borderRadius: moderateScale(20),
    backgroundColor: '#FFF',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.15,
    shadowRadius: 3.84,
    elevation: 5,
  },
  icon: {
    width: moderateScale(20),
    height: moderateScale(20),
  },
  safeArea: {
    backgroundColor: '#FFF',
  },
  container: {
    height: moderateScale(70),
    paddingHorizontal: moderateScale(14),
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderColor: colors.border,
  },
  sideContainer: {
    width: moderateScale(44),
    height: moderateScale(44),
    alignItems: 'center',
    justifyContent: 'center',
  },
  centerContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: moderateScale(18),
    fontFamily: activeFonts.Medium,
  },
  subtitle: {
    fontSize: moderateScale(14),
    color: colors.lightGrey,
  },
})
