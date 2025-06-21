import React, { useState, useEffect } from 'react';
import HistogramView from './view';
import { HistogramItem, HistogramSupaData } from "../../../../../entities/histogram";
import { GPSBubble } from "../../../../../entities/GPSBubble";
import { useMapStore } from "../../../../googleMap/useMapStore";
import { getHistoData } from "../../../../../supabaseCalls/photoSupabaseCalls";

type HistogramProps = {
  animal:    string
};

export default function Histogram(props: HistogramProps) {
  const boundaries = useMapStore((state) => state.gpsBubble);
  const [histoData, setHistoData] = useState<HistogramItem[]>([]);

  useEffect(() => {
    if (boundaries) {
      getHistogramData();
    }
  }, [boundaries]);

  const getHistogramData = async () => {
    if (boundaries) {
      const historgramData = await GPSBubble.getItemsInGpsBubble(getHistoData, boundaries, [props.animal]);

      let i = 1;
      const dataArray = [];
      const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

      if (historgramData) {
        const maxVal = Math.max(...historgramData.map((item: { num: number }) => item.num));
        for (i = 1; i < 13; i++) {
          historgramData.forEach((dataPoint: HistogramSupaData) => {
            if (dataPoint.month === i) {
              dataArray.push({ value: (dataPoint.num / maxVal) * 100, month: months[i - 1] });
            }
          });
          if (dataArray.length < i) {
            dataArray.push({ value: 0, month: months[i - 1] });
          }
        }
        setHistoData(dataArray);
      }
    }
  };

  return (
    <HistogramView histoData={histoData} hoverHide={true} />
  );
}
