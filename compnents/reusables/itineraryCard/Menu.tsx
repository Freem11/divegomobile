import React, { FC, useRef } from "react";
import { View } from "react-native";
import Popover from "react-native-popover-view";
import { Placement } from "react-native-popover-view/dist/Types";
import { moderateScale } from "react-native-size-matters";

import { colors } from "../../styles";
import ButtonIcon from "../buttonIcon";
import IconWithLabel from "../iconWithLabal";

import * as S from "./styles";

interface MenuProps {
  isVisible: boolean;
  setIsVisible: (isVisible: boolean) => void;
  handleEdit: () => void;
  handleDelete: () => void;
}

export const Menu: FC<MenuProps> = ({ isVisible, setIsVisible, handleEdit, handleDelete }) => {
  const iconRef = useRef<View>(null);

  return (
    <S.Actions>
      <View ref={iconRef} collapsable={false}>
        <ButtonIcon
          icon="dots-horizontal"
          size="icon"
          style={{
            height: moderateScale(30),
            width: moderateScale(30),
          }}
          onPress={() => setIsVisible(true)}
          fillColor={colors.neutralGrey}
        />
      </View>

      <Popover
        from={iconRef}
        isVisible={isVisible}
        onRequestClose={() => setIsVisible(false)}
        placement={Placement.AUTO}
        popoverStyle={{borderRadius: moderateScale(10)}}
      >
        <IconWithLabel
          label="Edit"
          iconName="pencil"
          buttonAction={() => {
            handleEdit();
            setIsVisible(false);
          }}
        />
        <IconWithLabel
          label="Delete"
          iconName="trash"
          buttonAction={() => {
            handleDelete();
            setIsVisible(false);
          }}
        />
      </Popover>
    </S.Actions>
  )
}
