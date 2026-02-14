import React from "react";

import * as S from "./styles";

type HistogramItemProps = {
  barValue: number;
  month: string;
};

export default function DataBar({ barValue, month }: HistogramItemProps) {
  return (
    <S.HistogramLine>
      <S.MonthLabel>{month}</S.MonthLabel>
      {barValue > 0 && <S.BarContainer barWidth={barValue} />}
    </S.HistogramLine>
  );
}
