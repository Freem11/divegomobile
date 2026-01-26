import React, { useEffect } from "react";
import { View, Text, ActivityIndicator } from "react-native";
import { Controller } from "react-hook-form";

import DynamicSelect from "../../../../reusables/dynamicSelect";

export const StepX = ({ fieldIndex, control, watch, runAIForIndex, getMoreAnimals }: any) => {
  const aiOriginal = watch(`SeaLife.${fieldIndex}.aiOriginal`);

  useEffect(() => {
    runAIForIndex(fieldIndex);
  }, [fieldIndex]);

  const isAiLoading = aiOriginal?.key === "loading";

  return (
    <View style={{ marginBottom: 20 }}>
      <View style={{ padding: 10, backgroundColor: "#f9f9f9", borderRadius: 8, marginBottom: 10 }}>
        <Text style={{ fontSize: 10, fontWeight: "700" }}>AI SUGGESTION</Text>
        {isAiLoading ? (
          <ActivityIndicator size="small" style={{ alignSelf: "flex-start" }} />
        ) : (
          <Text>{aiOriginal?.label || "No guess available"}</Text>
        )}
      </View>

      <Controller
        control={control}
        name={`SeaLife.${fieldIndex}`}
        key={`${fieldIndex}-${aiOriginal?.key}`}
        render={({ field: { onChange, value } }) => (
          <DynamicSelect
            value={value?.key === "loading" ? null : value}
            onChange={onChange}
            getMoreOptions={getMoreAnimals}
            extraOptions={!isAiLoading && aiOriginal ? [aiOriginal] : []}
            placeholder="Select species..."
          />
        )}
      />
    </View>
  );
};