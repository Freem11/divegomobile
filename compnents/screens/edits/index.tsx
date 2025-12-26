import React from "react";
import { Control } from "react-hook-form";

import { Form } from "./form";
import EditScreenView from "./view";

type EdittingScreenProps = {
  editInfo: string,
  control: Control<Form, any, Form>
  onSubmit: () => void;
};

export default function EdittingScreen({
  editInfo,
  control,
  onSubmit
}: EdittingScreenProps) {

  return (
    <EditScreenView
      editInfo={editInfo}
      control={control}
      onSubmit={onSubmit}
    />
  );

}