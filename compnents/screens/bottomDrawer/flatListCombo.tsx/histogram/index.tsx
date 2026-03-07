import React, { useState, useEffect } from "react";

import { HistogramItem, HistogramSupaData } from "../../../../../entities/histogram";
import { GPSBubble } from "../../../../../entities/GPSBubble";
import { useMapStore } from "../../../../googleMap/useMapStore";
import { getHistoData } from "../../../../../supabaseCalls/photoSupabaseCalls";

import HistogramView from "./view";

type HistogramProps = {
  animal: string;
  boundaries?: GPSBubble | null; // ADD THIS PROP
};

export default function Histogram(props: HistogramProps) {
  // 1. Logic: If props.boundaries exists (Mini Map mode), use it.
  // Otherwise, fall back to the Global Store (Main Map mode).
  const globalBoundaries = useMapStore((state) => state.gpsBubble);
  const activeBoundaries = props.boundaries || globalBoundaries;

  const [histoData, setHistoData] = useState<HistogramItem[]>([]);

  // 2. Watch activeBoundaries. This will now fire when the Mini Map moves
  // because SeaLifeScreenView is passing the local state down.
  useEffect(() => {
    if (activeBoundaries) {
      getHistogramData();
    }
  }, [activeBoundaries, props.animal]);

  const getHistogramData = async () => {
    if (activeBoundaries) {
      // Use activeBoundaries (local or global) for the fetch
      const historgramData = await GPSBubble.getItemsInGpsBubble(
        getHistoData,
        activeBoundaries,
        [props.animal]
      );

      let i = 1;
      const dataArray = [];
      const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

      if (historgramData) {
        const maxVal = Math.max(...historgramData.map((item: { num: number }) => item.num));

        for (i = 1; i < 13; i++) {
          let found = false;
          historgramData.forEach((dataPoint: HistogramSupaData) => {
            if (dataPoint.month === i) {
              dataArray.push({
                value: maxVal > 0 ? (dataPoint.num / maxVal) * 50 : 0,
                month: months[i - 1]
              });
              found = true;
            }
          });

          if (!found) {
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