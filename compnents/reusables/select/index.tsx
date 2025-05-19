import React, {
  useState,
  useRef,
  useEffect,
  useMemo,
  useCallback,
  forwardRef,
} from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';

import Dropdown from './components/dropdown';
import SelectedTag from './components/selectedTag';
import DropdownItem from './components/dropdownItem';

import getInitialValue from './utils/getInitialValue';
import getResultValue from './utils/getResultValue';
import { moderateScale } from "react-native-size-matters";
import { colors, fontSizes } from "../../styles";

// ----------------------
// Types
// ----------------------

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
  placeholder: 'Select',
  disabled: false,
  error: null,
  isFetching: false,
  value: [],
  options: [],
  labelInValue: false,
  debounceTimeout: 400,
  className: '',
  iconLeft: null,
  dropdownItemComponent: DropdownItem,
  dropdownComponent: Dropdown,
  iconSelectArrow: true,
  modeSelectedTags: 'off' as 'on' | 'off' | 'empty',
  modeDropdownOpen: 'onChange' as 'onClick' | 'onChange',
  triggerOnChangeWhenReselect: false,
  onSearch: (search: string) => {},
};

export type SelectProps = Partial<typeof defaultProps> & {
  name?: string;
  onChange?: (event: {
    target: { name?: string; value: Option | Option[] | string | string[] };
  }) => void;
};

// ----------------------
// Component
// ----------------------

const Select = forwardRef<TextInput, SelectProps>((incomingProps, forwardedRef) => {
  const props = { ...defaultProps, ...incomingProps };

  console.log(props)
  const searchRef = useRef<TextInput>(null);
  const [isOpen, setIsOpen] = useState(false);
  const [searchValue, setSearchValue] = useState('');
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  const options: Values = useMemo(() => {
    return new Map(props.options.map((option: Option) => [option.key, option]));
  }, [props.options]);

  const [value, setValue] = useState<Values>(
    getInitialValue(props.value, options)
  );

  const isMulti = props.maxSelectedOptions > 1;
  const showSelectedTags = props.modeSelectedTags === 'on' || isMulti;
  const shouldDisplayCreate = props.allowCreate && !!searchValue;

  useEffect(() => {
    if (props.modeSelectedTags === 'off' && !isMulti && value.size > 0) {
      setSearchValue(Array.from(value.values())[0].label);
    }
  
    if (props.modeSelectedTags === 'empty') {
      setSearchValue('');
    }
  
    if (typeof props.onChange === 'function') {
      const result = getResultValue(value, props.labelInValue, isMulti);
  
      // Ensure that we convert any 'string' values to 'Option<object>' if necessary
      let typedResult: string | Option<object> | Option<object>[] | string[];
  
      if (Array.isArray(result)) {
        // Ensure that each value in the array is of type Option<object>
        typedResult = result.map((item) => {
          if (typeof item === 'string') {
            return { key: item, label: item }; // convert string to Option<object>
          }
          return item;
        });
      } else {
        if (typeof result === 'string') {
          typedResult = { key: result, label: result }; // convert string to Option<object>
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
    if (!options.size) {
      searchRef.current?.focus();
    }
    if (
      props.modeDropdownOpen === 'onClick' ||
      options.size ||
      shouldDisplayCreate
    ) {
      setIsOpen(!isOpen);
    }
  };

  const onSearch = (text: string) => {
    setSearchValue(text);
    if (props.modeDropdownOpen === 'onChange' && !isOpen) {
      setIsOpen(true);
    }

    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    timeoutRef.current = setTimeout(() => {
      props.onSearch(text);
    }, props.debounceTimeout);
  };

  const selectItem = useCallback((key: string) => {
    setSearchValue('');

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

    setSearchValue('');
  }, []);

  const getPlaceholder = () => {
    if (showSelectedTags) return value.size ? undefined : props.placeholder;
    return searchValue ? undefined : props.placeholder;
  };

  return (
    <View style={styles.container} accessibilityRole="list">
      {/* Trigger */}
      <TouchableOpacity onPress={onTriggerClick} style={styles.trigger}>
        {props.iconLeft && (
          <View style={styles.iconLeft}>{props.iconLeft}</View>
        )}

        <View style={styles.triggerContent}>
          {showSelectedTags &&
            Array.from(value.values()).map((option) => (
              <SelectedTag
                key={option.key}
                label={option.label}
                deselctItem={() => deselctItem(option.key)}
              />
            ))}

          <TextInput
            ref={searchRef}
            value={searchValue}
            onChangeText={onSearch}
            placeholder={getPlaceholder()}
            editable={!props.disabled}
            style={styles.input}
            multiline={false}
            numberOfLines={1} 
          />
        </View>

        {props.iconSelectArrow && (
          <Text style={styles.arrow}>
            {props.iconSelectArrow === true ? '↓' : props.iconSelectArrow}
          </Text>
        )}
      </TouchableOpacity>

      {/* Dropdown */}
      {(isOpen || shouldDisplayCreate) && (
        <View style={styles.dropdownWrapper}>
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
        </View>
      )}
    </View>
  );
});

// ----------------------
// Styles
// ----------------------

const styles = StyleSheet.create({
  container: {
  },
  trigger: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingTop: moderateScale(4),
    borderColor: colors.neutralGrey,
    borderBottomWidth: moderateScale(2),
  },
  iconLeft: {
    marginRight: 6,
    width: moderateScale(24),
    height: moderateScale(24),
  },
  triggerContent: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  input: {
    flex: 1,
    minWidth: 100,
    fontSize: moderateScale(fontSizes.StandardText),
  },
  arrow: {
    marginLeft: 6,
    fontSize: moderateScale(fontSizes.SmallText),
  },
  dropdownWrapper: {
    marginTop: 4,
  },
});

// ----------------------
// Exports
// ----------------------

export default Select;
// export type { SelectProps };
