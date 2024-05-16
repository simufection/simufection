"use client";
import { Axios } from "@/services/axios";
import { useEffect, useState } from "react";
type Data = {
  urId: string;
  toChar: string;
  action: string;
};
export const DataAnalysis = () => {
  const [data, setData] = useState<Data[]>([]);
  const visitData = data.filter((d) => d.action == "visit");
  const clearData = data.filter((d) => d.action == "clear");

  const set = new Set(visitData.map((item) => item.urId));

  const date_16 = new Date("2024/05/16").getDate();
  const date_17 = new Date("2024/05/17").getDate();
  const date_18 = new Date("2024/05/18").getDate();
  const date_19 = new Date("2024/05/19").getDate();
  const data_16 = visitData.filter(
    (d) => new Date(d.toChar).getDate() == date_16
  );
  const data_17 = visitData.filter(
    (d) => new Date(d.toChar).getDate() == date_17
  );
  const data_18 = visitData.filter(
    (d) => new Date(d.toChar).getDate() == date_18
  );
  const data_19 = visitData.filter(
    (d) => new Date(d.toChar).getDate() == date_19
  );
  useEffect(() => {
    Axios.post("/api/getData").then((res) => {
      if (res.data.success) {
        setData(res.data.data);
      }
    });
  }, []);
  return (
    <div style={{ display: "flex", flexDirection: "column" }}>
      <span>合計アクセス数：{visitData.length}</span>
      <span>合計アクセス数(5/16)：{data_16.length}</span>
      <span>合計アクセス数(5/17)：{data_17.length}</span>
      <span>合計アクセス数(5/18)：{data_18.length}</span>
      <span>合計アクセス数(5/19)：{data_19.length}</span>
      <span>合計アクセス人数：{set.size}</span>
      <span>合計クリア数：{clearData.length}</span>
      <></>
    </div>
  );
};
