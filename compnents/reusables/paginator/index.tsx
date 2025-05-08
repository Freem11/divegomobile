import React, { useEffect, useRef, useState } from "react";
import { Dimensions, Keyboard, Platform, ScrollView, View } from "react-native";
import * as S from "./styles";
import BottomMenu from "../bottomMenu";
import { moderateScale } from "react-native-size-matters";

const windowHeight = Dimensions.get("window").height;

type ScreensProps = {
  children: React.ReactNode[];
};

type ButtonsProps = {
  children: React.ReactElement[];
};

const Screens = React.forwardRef<ScrollView, ScreensProps>(({ children }, ref) => (
  <ScrollView
    horizontal
    pagingEnabled
    scrollEnabled={false}
    ref={ref}
    showsHorizontalScrollIndicator={false}
    keyboardShouldPersistTaps="handled"
    contentContainerStyle={{  
      height:
      Platform.OS === 'ios'
        ? windowHeight - moderateScale(85)
        : windowHeight - moderateScale(75) 
      }}
  >
    {children.map((child, index) => (
      <S.PageContent key={index}>
        {child}
      </S.PageContent>
    ))}
  </ScrollView>
));

const Buttons: React.FC<ButtonsProps & { onPress?: (index: number) => void }> = ({ children, onPress }) => (
  <BottomMenu>
  {children.map((button, index) => (
  <React.Fragment key={index}>
    {React.cloneElement(button, {
      onPress: () => onPress(index),
    })}
  </React.Fragment>
))}
  </BottomMenu>
);
export type PaginatorProps = {
  defaultPage?: number;
  children: React.ReactNode;
};

const Paginator: React.FC<PaginatorProps> & {
  Screens: typeof Screens;
  Buttons: typeof Buttons;
} = ({ defaultPage, children }) => {


  const screens = React.Children.toArray(children).find(
    (child: any) => child.type === Paginator.Screens
  );
  const buttons = React.Children.toArray(children).find(
    (child: any) => child.type === Paginator.Buttons
  );

  const onPress = (index: number) => {
    scrollViewRef.current?.scrollTo({ x: index * S.windowWidth, animated: true });
  };
  const scrollViewRef = useRef(null);

 useEffect(() => {
    setTimeout(() => {
      scrollViewRef.current?.scrollTo({ x: (defaultPage || 0) * S.windowWidth, animated: true });
    }, 0.01);
  },[])


  return (
    <S.Wrapper>
      {/* Screens */}
      <View style={{height: Platform.OS === "ios" ? windowHeight-moderateScale(85) : windowHeight-moderateScale(45)}}>
      {screens && React.cloneElement(screens as React.ReactElement, {
        ref: scrollViewRef,
      })}
      </View>
      {/* Buttons */}
      <View style={{height: Platform.OS === "ios" ? moderateScale(85): moderateScale(15)}}>
      {buttons && React.cloneElement(buttons as React.ReactElement, {
        onPress,
      })}
       </View>
    </S.Wrapper>
  );
}

Paginator.Screens = Screens;
Paginator.Buttons = Buttons;

export default Paginator;