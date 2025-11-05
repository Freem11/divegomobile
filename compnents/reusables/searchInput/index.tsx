import React, { ForwardedRef } from "react";
import { TextInput, TextInputProps as RNTextInputProps, TouchableOpacity, Animated } from "react-native";

import Icon, { IconName } from "../../../icons/Icon";
import { colors } from "../../styles";

import * as S from "./styles";
import { useRotatingPlaceholder } from "./useDynamicPlaceholder";

export type SearchInputProps = {
  iconLeft?: React.ReactNode;
  iconRight?: React.ReactNode;
  error?: any;
  handleClear?: () => void;
} & RNTextInputProps;

const SearchInput = React.forwardRef<TextInput, SearchInputProps>(function SearchInput(
  { iconLeft, iconRight, error, onChangeText, handleClear, value, ...rest }: SearchInputProps,
  ref: ForwardedRef<TextInput>
) {

  const placeholderTerms = ["Places", "Dive Sites", "Sea Life"];
  const { rotatingWord, placeholderOpacity, setIsFocused } = useRotatingPlaceholder(placeholderTerms);

  return (
    <S.TextInputWrapper>
      {iconLeft && (
        <S.IconWrapperLeft>
          <Icon name={iconLeft as IconName} fill={colors.neutralGrey}/>
        </S.IconWrapperLeft>
      )}
      <Animated.View style={value ? null : [{ opacity: placeholderOpacity }]}>
        <S.StyledTextInput
          ref={ref}
          onChangeText={onChangeText}
          placeholderTextColor={colors.neutralGrey}
          placeholder={value ? null : `Search ${rotatingWord}`}
          value={value}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          {...rest}
        />
      </Animated.View>
      {iconRight && value.length > 0 ? (
        <TouchableOpacity onPress={handleClear}>
          <S.IconWrapperRight>
            <Icon name={iconRight as IconName} fill={colors.themeBlack}/>
          </S.IconWrapperRight>
        </TouchableOpacity>
      )
        :  <S.IconWrapperRight/>}
    </S.TextInputWrapper>
  );
});

export default SearchInput;
