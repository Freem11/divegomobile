import React from "react";
import { Control } from "react-hook-form";

import { Form } from "./form";
import EditScreenView from "./view";

type EdittingScreenProps = {
  editInfo: string,
  control: Control<Form, any, Form>
  reset: (values: any) => void;
  onSubmit: () => void;
};

export default function EdittingScreen({
  editInfo,
  control,
  reset,
  onSubmit
}: EdittingScreenProps) {

  React.useEffect(() => {
    return () => {
      reset({
        name: "",
        bio: "",
        id: undefined,
        uri: ""
      });
    };
  }, [reset]);
  return (
    <EditScreenView
      editInfo={editInfo}
      control={control}
      onSubmit={onSubmit}
    />
  );

}