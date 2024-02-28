"use client";
import Image from "next/image";
import React, { useEffect, useState } from "react";
import titleImage from "@/assets/img/title.png";

const Home = () => {
  return (
    <>
      <Image
        className="p-game__title-img"
        src={titleImage}
        alt="title"
        style={{ objectFit: "contain", width: "100%", height: "100%" }}
        priority
      />
    </>
  );
};

export default Home;
