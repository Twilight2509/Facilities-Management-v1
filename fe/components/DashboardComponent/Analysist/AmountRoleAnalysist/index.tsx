import React, { useState, useEffect } from "react";
import { Chart } from "primereact/chart";
import { Tooltip } from "antd";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFileCsv } from "@fortawesome/free-solid-svg-icons";
import { userStatic } from "../../../../services/static.api";

export default function AmountRoleAnalysist() {
  const [chartData, setChartData] = useState({});
  const [chartOptions, setChartOptions] = useState({});

  useEffect(() => {
    userStatic()
      .then((res: any) => {
        const data = {
          labels: Object.keys(res.data.data),
          datasets: [
            {
              data: Object.values(res.data.data),
              backgroundColor: ["#007bff", "#ffc107", "#28a745"], // Blue, Yellow, Green
              hoverBackgroundColor: ["#0056b3", "#d39e00", "#218838"], // Darker shades
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
      <p className="font-bold text-center mb-5">Thống kê người dùng website</p>
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
