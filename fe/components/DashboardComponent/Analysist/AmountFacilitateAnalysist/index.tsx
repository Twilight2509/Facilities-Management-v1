import React, { useState, useEffect } from "react";
import { Chart } from "primereact/chart";
import { Tooltip } from "antd";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFileCsv } from "@fortawesome/free-solid-svg-icons";
import { faciStatic } from "../../../../services/static.api";

export default function AmountFacilitateAnlalysist() {
  const [chartData, setChartData] = useState({});
  const [chartOptions, setChartOptions] = useState({});

  function getRandomColor() {
    // Generate random hex color
    return "#" + Math.floor(Math.random() * 16777215).toString(16);
  }

  useEffect(() => {
    faciStatic()
      .then((res: any) => {
        const dataKeys = Object.keys(res.data.data);
        const documentStyle = getComputedStyle(document.documentElement);
        const backgroundColor = [];

        // Generate random colors based on the number of labels
        for (let i = 0; i < dataKeys.length; i++) {
          backgroundColor.push(getRandomColor());
        }

        const data = {
          labels: dataKeys,
          datasets: [
            {
              data: Object.values(res.data.data),
              backgroundColor: backgroundColor,
            },
          ],
        };

        const options = {
          plugins: {
            legend: {
              labels: {
                usePointStyle: true,
              },
            },
          },
        };

        setChartData(data);
        setChartOptions(options);
      })
      .catch((err) => {
        console.log("Error fetching data:", err);
      });
  }, []);

  return (
    <div className="relative basis-1/2 h-96 border">
      <p className="font-bold text-center mb-5">Thống kê số lượng từng loại</p>
      <div className="flex justify-center">
        <Chart
          type="pie"
          data={chartData}
          options={chartOptions}
          className=""
        />
      </div>
    </div>
  );
}
