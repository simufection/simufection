"use client";
import { ColorData } from "@/models/colorModel";
import { notFound, useParams } from "next/navigation";
import React, { useEffect, useState } from "react";

const Page = () => {
  const { color } = useParams();
  const [colors, setColors] = useState<ColorData[] | null>(null);
  const [colorData, setColor] = useState<ColorData | null>(null);

  useEffect(() => {
    fetch("/api/colors", {
      method: "GET",
    }).then(async (response) => {
      const data = await response.json();
      await setColors(data.data);
    });
  }, []);

  useEffect(() => {
    checkColor();
  }, [colors]);

  const checkColor = () => {
    colors != null && colors.findIndex((item) => item.name == color) == -1
      ? notFound()
      : setColor(colors?.find((item) => item.name == color) || null);
  };

  return !colors ? (
    <div className="p-hoge__loading">Loading...</div>
  ) : (
    <>
      <div
        className="p-hoge__colorbox"
        style={{ backgroundColor: `#${colorData?.code}` }}
      />
      <span className={`p-hoge__spans -${colorData?.name_two}`}>
        {colorData?.name!}
      </span>
    </>
  );
};
export default Page;
