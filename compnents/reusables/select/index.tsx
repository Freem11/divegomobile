import React, { useState, useEffect, forwardRef, useMemo } from "react";
import { TextInput, FlatList, TouchableOpacity, Text, Keyboard } from "react-native";

import * as S from "./styles";

const Select = forwardRef<TextInput, any>((props, ref) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchValue, setSearchValue] = useState("");

  const optionsMap = useMemo(() =>
    new Map((props.options || []).map((o: any) => [String(o.key), o])),
    [props.options]
  );

  // This ensures the label shows up when navigating back or AI finishes
  useEffect(() => {
    const activeValue = Array.isArray(props.value) ? props.value[0] : props.value;
    if (activeValue?.label && activeValue.key !== "loading") {
      setSearchValue(activeValue.label);
    } else if (!activeValue) {
      setSearchValue("");
    }
  }, [props.value]);

  const handleSelect = (item: any) => {
    setSearchValue(item.label);
    setIsOpen(false);
    Keyboard.dismiss();
    if (props.onChange) {
      props.onChange({ target: { value: item } });
    }
  };

  return (
    <S.Container hasError={!!props.error}>
      <S.Trigger onPress={() => setIsOpen(!isOpen)} activeOpacity={1}>
        <S.Input
          ref={ref}
          value={searchValue}
          onChangeText={(t) => {
            setSearchValue(t);
            props.onSearch?.(t);
          }}
          onFocus={() => setIsOpen(true)}
          placeholder={props.placeholder}
        />
        <S.IconRight>
          <S.ArrowIcon isOpen={isOpen}>{isOpen ? "▲" : "▼"}</S.ArrowIcon>
        </S.IconRight>
      </S.Trigger>

      {isOpen && (
        <S.DropdownWrapper>
          <FlatList
            data={props.options}
            keyExtractor={(item) => String(item.key)}
            keyboardShouldPersistTaps="handled"
            renderItem={({ item }) => (
              <TouchableOpacity
                onPress={() => handleSelect(item)}
                style={{ padding: 15, borderBottomWidth: 1, borderColor: "#eee" }}
              >
                <Text>{item.label}</Text>
              </TouchableOpacity>
            )}
            ListEmptyComponent={() => (
              <Text style={{ padding: 15, textAlign: "center", color: "#999" }}>
                {props.isFetching ? "Searching..." : "No results found"}
              </Text>
            )}
          />
        </S.DropdownWrapper>
      )}
    </S.Container>
  );
});

export default Select;