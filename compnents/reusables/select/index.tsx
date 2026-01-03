import React, {
  useState,
  useRef,
  useEffect,
  useMemo,
  useCallback,
  forwardRef,
} from "react";
import { Keyboard, TextInput } from "react-native";

import { colors } from "../../styles";

import * as S from "./styles";
import Dropdown from "./components/dropdown";
import SelectedTag from "./components/selectedTag";
import DropdownItem from "./components/dropdownItem";
import getInitialValue from "./utils/getInitialValue";
import getResultValue from "./utils/getResultValue";

export type Option<T = object> = {
  key: string;
  label: string;
  data?: T;
  userCreated?: boolean;
};

export type Values = Map<string, Option>;

const defaultProps = {
  maxSelectedOptions: 1,
  allowCreate: false,
  placeholder: "Select",
  disabled: false,
  error: null,
  isFetching: false,
  value: [],
  options: [],
  labelInValue: false,
  debounceTimeout: 400,
  className: "",
  iconLeft: null,
  iconRight: null,
  dropdownItemComponent: DropdownItem,
  dropdownComponent: Dropdown,
  iconSelectArrow: true,
  modeSelectedTags: "off" as "on" | "off" | "empty",
  modeDropdownOpen: "onChange" as "onClick" | "onChange",
  triggerOnChangeWhenReselect: false,
  onSearch: (search: string) => { },
};

export type SelectProps = Partial<typeof defaultProps> & {
  name?: string;
  onChange?: (event: {
    target: { name?: string; value: Option | Option[] | string | string[] };
  }) => void;
};

const Select = forwardRef<TextInput, SelectProps>((incomingProps, forwardedRef) => {
  const props = { ...defaultProps, ...incomingProps };
  const searchRef = useRef<TextInput>(null);
  const [isOpen, setIsOpen] = useState(false);
  const [searchValue, setSearchValue] = useState("");
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  // 🔑 NEW STATE: Flag to handle nested touch event conflicts
  const [isIconPressing, setIsIconPressing] = useState(false);

  const options: Values = useMemo(() => {
    return new Map(props.options.map((option: Option) => [option.key, option]));
  }, [props.options]);

  const [value, setValue] = useState<Values>(
    getInitialValue(props.value, options)
  );

  const isMulti = props.maxSelectedOptions > 1;
  const showSelectedTags = props.modeSelectedTags === "on" || isMulti;
  const shouldDisplayCreate = props.allowCreate && !!searchValue;

  useEffect(() => {
    if (props.modeSelectedTags === "off" && !isMulti && value.size > 0) {
      setSearchValue(Array.from(value.values())[0].label);
    }

    if (props.modeSelectedTags === "empty") {
      setSearchValue("");
    }

    if (typeof props.onChange === "function") {
      const result = getResultValue(value, props.labelInValue, isMulti);

      let typedResult: string | Option<object> | Option<object>[] | string[];

      if (Array.isArray(result)) {
        typedResult = result.map((item) => {
          if (typeof item === "string") {
            return { key: item, label: item };
          }
          return item;
        });
      } else {
        if (typeof result === "string") {
          typedResult = { key: result, label: result };
        } else {
          typedResult = result;
        }
      }

      props.onChange({
        target: { name: props.name, value: typedResult }
      });
    }
  }, [value]);

  const onTriggerClick = () => {
    if (isIconPressing) {
      return;
    }

    if (searchRef.current?.isFocused()) {
      return;
    }

    if (!options.size) {
      searchRef.current?.focus();
    }
    if (
      props.modeDropdownOpen === "onClick" ||
      options.size ||
      shouldDisplayCreate
    ) {
      setIsOpen(!isOpen);
      Keyboard.dismiss();
    }
  };

  const onSearch = (text: string) => {
    setSearchValue(text);
    if (props.modeDropdownOpen === "onChange" && !isOpen) {
      setIsOpen(true);
    }

    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    timeoutRef.current = setTimeout(() => {
      props.onSearch(text);
    }, props.debounceTimeout);
  };

  const selectItem = useCallback((key: string) => {
    setSearchValue("");

    setValue((prev) => {
      const option = options.get(key);
      if (!option) return prev;

      if (props.maxSelectedOptions === 1) {
        if (!props.triggerOnChangeWhenReselect && prev.has(key)) return prev;
        return new Map([[key, option]]);
      }

      const updated = new Map(prev);
      if (updated.has(key)) {
        updated.delete(key);
      } else if (updated.size < props.maxSelectedOptions) {
        updated.set(key, option);
      }

      return updated;
    });

    if (!isMulti) setIsOpen(false);
  }, [options]);

  const deselctItem = (key: string) => {
    setValue((prev) => {
      const updated = new Map(prev);
      updated.delete(key);
      return updated;
    });
  };

  const createItem = useCallback((val: string) => {
    if (!val) return;

    setValue((prev) => {
      const updated = new Map(prev);
      if (updated.has(val)) return updated;
      if (updated.size >= props.maxSelectedOptions) updated.clear();
      updated.set(val, { key: val, label: val, userCreated: true });
      return updated;
    });

    setSearchValue("");
  }, []);

  const getPlaceholder = () => {
    if (showSelectedTags) return value.size ? undefined : props.placeholder;
    return searchValue ? undefined : props.placeholder;
  };

  const onRightIconPress = () => {
    // 🔑 FIX: Set flag to prevent onTriggerClick from running immediately after
    setIsIconPressing(true);
    setTimeout(() => {
      setIsIconPressing(false);
    }, 100);

    if (!isOpen) {
      // 1. Opens dropdown instantly via onSearch logic
      // 2. Triggers search with "" (to load all options via DynamicSelect)
      onSearch("");
      searchRef.current?.focus();
    } else {
      setIsOpen(false);
      searchRef.current?.blur();
    }
  };

  return (
    <S.Container accessibilityRole="list">
      <S.Trigger onPress={onTriggerClick}>
        {props.iconLeft && (
          <S.IconLeft>{props.iconLeft}</S.IconLeft>
        )}

        <S.TriggerContent>
          {showSelectedTags &&
            Array.from(value.values()).map((option) => (
              <SelectedTag
                key={option.key}
                label={option.label}
                deselctItem={() => deselctItem(option.key)}
              />
            ))}

          <S.Input
            ref={searchRef}
            value={searchValue}
            onChangeText={onSearch}
            placeholder={getPlaceholder()}
            placeholderTextColor={colors.neutralGrey}
            editable={!props.disabled}
            multiline={false}
            numberOfLines={1}
          />
        </S.TriggerContent>

        {props.iconRight && (
          <S.IconLeft onPress={onRightIconPress}>{props.iconRight}</S.IconLeft>
        )}
      </S.Trigger>

      {(isOpen || shouldDisplayCreate) && (
        <S.DropdownWrapper>
          <props.dropdownComponent
            options={options}
            searchText={searchValue}
            shouldDisplayCreate={shouldDisplayCreate}
            createItem={createItem}
          >
            {Array.from(options.values()).map((option: Option) => (
              <props.dropdownItemComponent
                key={option.key}
                option={option}
                selected={value.has(option.key)}
                onSelect={selectItem}
              />
            ))}
          </props.dropdownComponent>
        </S.DropdownWrapper>
      )}
    </S.Container>
  );
});

export default Select;