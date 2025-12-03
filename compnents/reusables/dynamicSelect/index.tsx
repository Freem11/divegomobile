import React, { useState, useEffect } from "react";
import { TextInput } from "react-native";

import Select, { SelectProps } from "../select";

const defaultProps = {
  searchLimit: 100,
};

export type GetMoreOptions = (
  search: string,
  limit: number,
  skip: number
) => Promise<{ options: any[] }>;

type DynamicSelectProps = SelectProps & Partial<typeof defaultProps> & {
  getMoreOptions: GetMoreOptions;
  getSelectedOptions?: (values: any) => Promise<any>;
};

const DynamicSelect = React.forwardRef<TextInput, DynamicSelectProps>(
  function DynamicSelect(_props, forwardedRef) {
    const props = { ...defaultProps, ..._props };
    const { getSelectedOptions, getMoreOptions, searchLimit, ...rest } = props;

    const [options, setOptions] = useState([]);
    const [isFetching, setIsFetching] = useState(false);
    const [searchOffset, setSearchOffset] = useState(0);
    const [currentSearch, setCurrentSearch] = useState("");

    useEffect(() => {
      init();
    }, []);

    const init = async () => {
      try {
        if (getSelectedOptions) {
          const data = await getSelectedOptions(props.value);
          setIsFetching(false);
          if (data?.options?.length) {
            setOptions(data.options);
          }
        }

        if (!props.disabled) {
          loadOptions("", 0, true);
        }
      } catch (e) {
        setIsFetching(false);
        console.warn(e);
      }
    };

    const onSearch = (search: string) => {
      setCurrentSearch(search);
      loadOptions(search, 0, true);
    };

    const loadOptions = async (
      search: string,
      offset: number,
      replaceExistingOptions = false
    ) => {
      if (!getMoreOptions) return;

      setIsFetching(true);

      const [data] = await Promise.all([
        getMoreOptions(search, searchLimit, offset),
        new Promise(resolve => setTimeout(resolve, 300)),
      ]);

      setIsFetching(false);

      if (!data?.options) {
        setOptions([]);
        return;
      }

      setOptions(prev =>
        replaceExistingOptions ? data.options : [...prev, ...data.options]
      );
    };

    return (
      <Select
        ref={forwardedRef}
        isFetching={isFetching}
        options={options}
        onSearch={onSearch}
        {...rest}
      />
    );
  }
);

export default DynamicSelect;