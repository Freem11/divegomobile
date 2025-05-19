import styled from 'styled-components/native';
import { moderateScale } from 'react-native-size-matters';
import {
  colors,
  fontSizes,
} from '../../../styles';

//DropDown

export const Dropdown = styled.View`
  border-color:${colors.neutralGrey};
  border-width: ${moderateScale(1)}px;
  border-radius: ${moderateScale(4)}px;
  padding-vertical: ${moderateScale(8)}px;
  padding-horizontal: ${moderateScale(12)}px;
`;

export const OptionList = styled.View`
  flex-direction: column;
`;

export const CreateButton = styled.TouchableOpacity`
  margin-top:  ${moderateScale(8)}px;
  padding:  ${moderateScale(10)}px;
  background-color: ${colors.buttonPressOverlay};
  border-radius: ${moderateScale(4)}px;
`;

export const TextWrapper = styled.Text`
`;

export const SearchTerm = styled.Text`
   font-weight: bold;
`;

//DropDownItem

export const ItemWrapper = styled.View`
   margin-vertical: ${moderateScale(4)}px;
`;

export const ItemButton = styled.TouchableOpacity<{ selected: boolean }>`
  padding: 10px;
  border-radius: 4px;
  background-color: ${({ selected }) => (selected ? '#cce5ff' : '#eee')};
`;

export const ItemText = styled.Text`
  font-size: ${moderateScale(16)}px;;
`;


//SelectedTag

export const Tag = styled.View`
  flex-direction: row;
  alignitems: center;
  justifycontent: center;
  background-color: ${colors.buttonPressOverlay};
  padding-horizontal: ${moderateScale(6)}px;
  padding-vertical: ${moderateScale(4)}px;
  margin-bottom: ${moderateScale(4)}px;
  border-radius: ${moderateScale(16)}px;
`;

export const Label = styled.Text`
  font-size: ${moderateScale(fontSizes.SmallText)}px;
  margin-horizontal: ${moderateScale(4)}px;
`;

export const RemoveButton = styled.TouchableOpacity`
  padding:  ${moderateScale(2)}px;
`;

export const RemoveText = styled.Text`
  font-size: ${moderateScale(fontSizes.SmallText)}px;
  color: ${colors.neutralGrey}
`;