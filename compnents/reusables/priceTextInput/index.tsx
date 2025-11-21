import React, { useState, useEffect } from "react";
import { TextInput } from "react-native";

import MobileTextInput, { TextInputProps } from "../textInput";

export type PriceTextInputProps = TextInputProps;

const formatCentsToCurrency = (centsString: string | number): string => {

  const cents = typeof centsString === "string"
    ? parseInt(centsString.replace(/[^0-9]/g, ""), 10)
    : Math.round(centsString);

  if (isNaN(cents) || cents === 0) return "";

  const dollars = cents / 100;

  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(dollars);
};

const cleanNumericString = (formattedValue: string): string => {
  return formattedValue.replace(/[^0-9]/g, "");
};

const PriceTextInput = React.forwardRef<TextInput, PriceTextInputProps>(
  function PriceTextInput({ error, value: initialValue, ...rest }: PriceTextInputProps, ref) {
    const [price, setPrice] = useState(initialValue || "");
    const [centsValue, setCentsValue] = useState(cleanNumericString(initialValue || ""));

    useEffect(() => {
      if (initialValue !== price && typeof initialValue === "string") {
        const cleanValue = cleanNumericString(initialValue);
        setCentsValue(cleanValue);
        setPrice(formatCentsToCurrency(cleanValue));
      }
    }, [initialValue]);

    const handlePriceChange = (data: any) => {
      const currPriceText = data.nativeEvent.text;

      const newCentsValue = cleanNumericString(currPriceText);

      if (newCentsValue === centsValue) {
        return;
      }

      const limitedCentsValue = newCentsValue.slice(0, 11);

      const formattedDisplay = formatCentsToCurrency(limitedCentsValue);

      setCentsValue(limitedCentsValue);
      setPrice(formattedDisplay);

      if (rest.onChangeText) {
        rest.onChangeText(formattedDisplay);
      }
    };

    const handleBlur = () => {
      if (!centsValue || parseInt(centsValue, 10) === 0) {
        setPrice("");
        setCentsValue("");
        if (rest.onChangeText) rest.onChangeText("");
        return;
      }

      const finalFormattedPrice = formatCentsToCurrency(centsValue);

      setPrice(finalFormattedPrice);

      if (rest.onChangeText) rest.onChangeText(finalFormattedPrice);
    };

    return (
      <MobileTextInput
        value={price}
        ref={ref}
        error={error}
        {...rest}
        keyboardType="numeric"
        onChange={handlePriceChange}
        onBlur={handleBlur}
      />
    );
  }
);

export default PriceTextInput;