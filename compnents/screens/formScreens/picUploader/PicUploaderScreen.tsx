import React, { useEffect, useCallback, useRef } from "react";
import { useForm, useFieldArray } from "react-hook-form";
import * as FileSystem from "expo-file-system/legacy";

import { identifySeaLife } from "../../../../ai-calls/aiCall";
import { DynamicSelectOptionsAnimals } from "../../../../entities/DynamicSelectOptionsAnimals";

import PicUploaderPageView from "./picUploader";

export default function PicUploaderScreen() {
  const { control, setValue, watch, getValues, formState: { errors } } = useForm({
    mode: "onChange",
    shouldUnregister: false,
    defaultValues: { SightingDate: new Date(), Photos: [], SeaLife: [] }
  });

  const { fields, append } = useFieldArray({ control, name: "SeaLife" });
  const photos = watch("Photos");
  const aiProcessing = useRef<Record<number, boolean>>({});

  useEffect(() => {
    if (photos.length > fields.length) {
      for (let i = fields.length; i < photos.length; i++) {
        append({ label: "Identifying...", key: "loading", aiOriginal: { label: "Identifying...", key: "loading" } });
      }
    }
  }, [photos.length]);

  const runAIForIndex = useCallback(async (index: number) => {
    const image = photos[index];
    const fieldPath = `SeaLife.${index}`;
    const shadowPath = `SeaLife.${index}.aiOriginal`;

    const currentVal = getValues(fieldPath);
    const currentAi = getValues(shadowPath);

    if (aiProcessing.current[index] ||
      (currentAi && currentAi.key !== "loading" && currentAi.key !== "none") ||
      (currentVal && currentVal.key !== "loading" && currentVal.key !== "none")) return;

    aiProcessing.current[index] = true;
    try {
      const base64 = await FileSystem.readAsStringAsync(image, { encoding: "base64" });
      const result = await identifySeaLife(base64);
      if (result) {
        const aiObj = { label: result, key: result, value: result };
        setValue(shadowPath, aiObj);
        if (!getValues(fieldPath) || getValues(fieldPath).key === "loading") {
          setValue(fieldPath, aiObj);
        }
      }
    } catch (e) {
      setValue(shadowPath, { label: "Not identified", key: "none" });
    } finally {
      aiProcessing.current[index] = false;
    }
  }, [photos, getValues, setValue]);

  return (
    <PicUploaderPageView
      control={control}
      errors={errors}
      watch={watch}
      setValue={setValue}
      seaLifeFields={fields}
      runAIForIndex={runAIForIndex}
      getMoreAnimals={DynamicSelectOptionsAnimals.getMoreOptions}
    />
  );
}