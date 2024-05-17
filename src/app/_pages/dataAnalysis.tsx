"use client";
import { Axios } from "@/services/axios";
import { formatDate } from "@/services/formatDate";
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
  const today = formatDate(new Date(), "yyyy/M/d");

  const set = new Set(visitData.map((item) => item.urId));

  const date_16 = new Date("2024/05/16").getDate();
  const date_17 = new Date("2024/05/17").getDate();
  const date_18 = new Date("2024/05/18").getDate();
  const date_19 = new Date("2024/05/19").getDate();
  const visitData_16 = visitData.filter(
    (d) => new Date(d.toChar).getDate() == date_16
  );
  const visitData_17 = visitData.filter(
    (d) => new Date(d.toChar).getDate() == date_17
  );
  const visitData_18 = visitData.filter(
    (d) => new Date(d.toChar).getDate() == date_18
  );
  const visitData_19 = visitData.filter(
    (d) => new Date(d.toChar).getDate() == date_19
  );

  const clearData_16 = clearData.filter(
    (d) => new Date(d.toChar).getDate() == date_16
  );
  const clearData_17 = clearData.filter(
    (d) => new Date(d.toChar).getDate() == date_17
  );
  const clearData_18 = clearData.filter(
    (d) => new Date(d.toChar).getDate() == date_18
  );
  const clearData_19 = clearData.filter(
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
      <span>{today}</span>
      <span>合計アクセス数：{visitData.length}</span>
      <span>合計アクセス数(5/16)：{visitData_16.length}</span>
      <span>合計アクセス数(5/17)：{visitData_17.length}</span>
      <span>合計アクセス数(5/18)：{visitData_18.length}</span>
      <span>合計アクセス数(5/19)：{visitData_19.length}</span>
      <span style={{ marginBottom: "10px" }}>合計アクセス人数：{set.size}</span>

      <span>合計クリア数：{clearData.length}</span>
      <span>合計クリア数(5/16)：{clearData_16.length}</span>
      <span>合計クリア数(5/17)：{clearData_17.length}</span>
      <span>合計クリア数(5/18)：{clearData_18.length}</span>
      <span>合計クリア数(5/19)：{clearData_19.length}</span>
      <></>
    </div>
  );
};
