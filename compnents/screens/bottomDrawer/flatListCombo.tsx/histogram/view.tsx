import React from 'react';
import * as S from "./styles";
import { HistogramItem } from "../../../../../entities/histogram";
import DataBar from "./histogramDataBar";

type HistogramViewProps = {
  histoData: HistogramItem[];
  hoverHide?: boolean;
};

export default function HistogramView({ histoData, hoverHide }: HistogramViewProps) {
  return (
    <S.MainContainer hoverHide={hoverHide}>
      <S.BarBox>
        {histoData.length > 0 &&
          histoData.map((data, index) => (
            <DataBar key={index} barValue={data.value} month={data.month} />
          ))}
      </S.BarBox>
    </S.MainContainer>
  );
}