"use client";
import React, { useEffect, useState } from "react";
import { randLevy } from "../../game/_stats/levy";

const Home = () => {
  const [ctx, setCtx] = useState<CanvasRenderingContext2D>();

  useEffect(() => {
    const _cvs = document.getElementById("myChart") as HTMLCanvasElement;
    const _ctx = _cvs.getContext("2d");
    if (_ctx) setCtx(_ctx);
  }, []);

  useEffect(() => {
    if (!ctx) return;
    const randomNumbers = generateUniformRandomNumbers(1000);

    plotDistribution(generateHistogram(randomNumbers, 20));
  }, [ctx]);

  const plotDistribution = (data: number[]) => {
    const chart = new Chart(ctx, {
      type: "bar",
      data: {
        labels: data.map((_, index) => index.toString()),
        datasets: [
          {
            label: "Random Number Distribution",
            data: data,
            backgroundColor: "rgba(54, 162, 235, 0.2)",
          },
        ],
      },
      options: {
        scales: {
          y: {
            beginAtZero: true,
          },
        },
      },
    });
  };
  const generateUniformRandomNumbers = (count: number) => {
    let numbers = [];
    for (let i = 0; i < count; i++) {
      numbers.push(Math.floor(randLevy(1, 4, 20)));
    }
    return numbers;
  };
  const generateHistogram = (data: number[], binCount: number) => {
    let max = Math.max(...data);
    let min = Math.min(...data);
    let binSize = (max - min) / binCount;
    let histogram = new Array(binCount).fill(0);

    data.forEach((value) => {
      let binIndex = Math.floor((value - min) / binSize);
      if (binIndex === binCount) {
        binIndex--;
      }
      histogram[binIndex]++;
    });

    return histogram;
  };

  return (
    <>
      <canvas id="myChart" width="400" height="400"></canvas>
    </>
  );
};

export default Home;
