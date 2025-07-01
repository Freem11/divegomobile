import React, { useState, useEffect } from 'react';
import MobileTextInput, { TextInputProps } from "../textInput";
import { TextInput } from "react-native";

export type PriceTextInputProps = TextInputProps;

const PriceTextInput = React.forwardRef<TextInput, PriceTextInputProps>(
  function PriceTextInput({ error, value: initialValue, ...rest }: PriceTextInputProps, ref) {
    const [price, setPrice] = useState(initialValue || "");
    const [prevPrice, setPrevPrice] = useState("");

    // Sync external value changes
    useEffect(() => {
      if (initialValue !== price && typeof initialValue === 'string') {
        setPrice(initialValue);
        setPrevPrice(initialValue.replace(/[^0-9.]/g, ""));
      }
    }, [initialValue]);

    const handlePriceChange = (data: any) => {
      const currPrice = data.nativeEvent.text;
      const curr2 = currPrice.replace(/[^0-9.]/g, '');
      const prev2 = prevPrice.replace(/[^0-9.]/g, '');

      const regex1 = /^\d+(\.\d{1,2})?$/; // valid currency
      const regex4 = /^\d+(\.)?$/;        // e.g., "123."

      let result = '';
      if (curr2 === '' || regex4.test(curr2)) {
        const num = curr2;
        setPrevPrice(num);
        result = num.length === 0 ? '' : '$' + num;
      } else {
        const validated = regex1.test(curr2);
        const num = validated ? curr2 : prev2;
        setPrevPrice(num);
        result = '$' + num;
      }

      setPrice(result);

      // ✅ Correct: Pass clean string to RHF
      if (rest.onChangeText) rest.onChangeText(result);
    };

    const handleBlur = () => {
      const numericPart = price?.replace(/[^0-9.]/g, '') ?? '';
      const roundedPrice = Math.round(parseFloat(numericPart) * 100) / 100;
      const formattedPrice = isNaN(roundedPrice) ? '' : `$${roundedPrice.toFixed(2)}`;
      setPrevPrice(numericPart);
      setPrice(formattedPrice);

      // ✅ Update RHF on blur as well
      if (rest.onChangeText) rest.onChangeText(formattedPrice);
    };

    return (
      <MobileTextInput
        value={price}
        ref={ref}
        error={error}
        {...rest}
        onChange={handlePriceChange}
        onBlur={handleBlur}
      />
    );
  }
);

export default PriceTextInput;
