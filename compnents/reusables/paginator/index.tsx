import React, { useEffect, useRef, useState } from "react";
import { Keyboard, ScrollView } from "react-native";
import * as S from "./styles";
import BottomMenu from "../bottomMenu";

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
    contentContainerStyle={S.PageContainer}
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
      {screens && React.cloneElement(screens as React.ReactElement, {
        ref: scrollViewRef,
      })}

      {/* Buttons */}
      {buttons && React.cloneElement(buttons as React.ReactElement, {
        onPress,
      })}
    </S.Wrapper>
  );
}

Paginator.Screens = Screens;
Paginator.Buttons = Buttons;

export default Paginator;