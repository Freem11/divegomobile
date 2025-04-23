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

const Screens: React.FC<ScreensProps> = ({ children }) => (
  <ScrollView
    horizontal
    pagingEnabled
    scrollEnabled={false}
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
);

const Buttons: React.FC<ButtonsProps & { onPress: (index: number) => void }> = ({ children, onPress }) => (
  <BottomMenu>
    {children.map((button, index) =>
      React.cloneElement(button, {
        key: index,
        onPress: () => onPress(index),
      })
    )}
  </BottomMenu>
);
export type PaginatorProps = {
  children: React.ReactNode;
};

const Paginator: React.FC<PaginatorProps> & {
  Screens: typeof Screens;
  Buttons: typeof Buttons;
} = ({ children }) => {


  const screens = React.Children.toArray(children).find(
    (child: any) => child.type === Paginator.Screens
  );
  const buttons = React.Children.toArray(children).find(
    (child: any) => child.type === Paginator.Buttons
  );

  const onPress = (index: number) => {
    scrollViewRef.current?.scrollTo({ x: index * S.windowWidth, animated: true });
    setPage(index);
  };
  const scrollViewRef = useRef(null);
  const [carrouselIndex, setCarrouselIndex] = useState(null);

  if(!carrouselIndex){
    setTimeout(() => {
      setCarrouselIndex(1)
    }, 0.05);
  }

  useEffect(() => {
    Keyboard.dismiss();
    setPage(carrouselIndex);
  }, [carrouselIndex]);

  const setPage = (pageIndex) => {
    scrollViewRef.current?.scrollTo({
      x: S.windowWidth * (pageIndex-1),
      animated: true,
    });
  };

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