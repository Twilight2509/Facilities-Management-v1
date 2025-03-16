"use client";
import React, { useState, useEffect } from "react";
import { Chart } from "primereact/chart";
import { weekOptions } from "../../../../data";
import { string } from "prop-types";
import { years } from "../../../../data";
import { getCurrentWeekTime } from "../../../../data";
import { Tooltip } from "antd";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFileCsv } from "@fortawesome/free-solid-svg-icons";

const dataByWeek = [
  {
    label: "Thống kê số lương tài khoản được tạo theo tuần",
    data: [540, 325, 702, 620, 500, 800, 900],
    backgroundColor: [
      "rgba(255, 159, 64, 0.2)",
      "rgba(255, 159, 64, 0.2)",
      "rgba(255, 159, 64, 0.2)",
      "rgba(255, 159, 64, 0.2)",
      "rgba(255, 159, 64, 0.2)",
      "rgba(255, 159, 64, 0.2)",
      "rgba(255, 159, 64, 0.2)",
    ],
    borderColor: [
      "rgb(255, 159, 64)",
      "rgb(255, 159, 64)",
      "rgb(255, 159, 64)",
      "rgb(255, 159, 64)",
      "rgb(255, 159, 64)",
      "rgb(255, 159, 64)",
    ],
    borderWidth: 1,
  },
];

const dataByYear = [
  {
    label: "Thống kê số lương tài khoản được tạo theo năm",
    data: [540, 325, 702, 620, 500, 800, 900, 500, 540, 450, 481, 125],
    backgroundColor: [
      "rgba(255, 159, 64, 0.2)",
      "rgba(255, 159, 64, 0.2)",
      "rgba(255, 159, 64, 0.2)",
      "rgba(255, 159, 64, 0.2)",
      "rgba(255, 159, 64, 0.2)",
      "rgba(255, 159, 64, 0.2)",
      "rgba(255, 159, 64, 0.2)",
    ],
    borderColor: [
      "rgb(255, 159, 64)",
      "rgb(255, 159, 64)",
      "rgb(255, 159, 64)",
      "rgb(255, 159, 64)",
      "rgb(255, 159, 64)",
      "rgb(255, 159, 64)",
      "rgb(255, 159, 64)",
    ],
    borderWidth: 1,
  },
];

const labelByYear = [
  "Tháng một",
  "Tháng hai",
  "Tháng ba",
  "Tháng tư",
  "Tháng năm",
  "Tháng sáu",
  "Tháng bảy",
  "Tháng tám",
  "Tháng chín",
  "Tháng mười",
  "Tháng mười một",
  "Tháng mười hai",
];

const labelByWeak = [
  "Thứ hai",
  "Thứ ba",
  "Thứ tư",
  "Thứ năm",
  "Thứ sáu",
  "Thứ bảy",
  "Chủ nhật",
];

export default function AccountAnalysist() {
  const [searchByYear, setSearchByYear] = useState(false);

  const [chartData, setChartData] = useState({});
  const [chartOptions, setChartOptions] = useState({});

  const date = new Date();

  const [year, setYear] = useState<string>(String(date.getFullYear()));

  const [weekTime, setWeekTime] = useState<number | null>(getCurrentWeekTime());

  console.log("getCurrentWeekTime::", getCurrentWeekTime());

  useEffect(() => {
    if (searchByYear === true) {
      setWeekTime(null);
    }
  }, [searchByYear]);

  useEffect(() => {
    const data = {
      labels: searchByYear ? [...labelByYear] : [...labelByWeak],

      datasets: searchByYear ? [...dataByYear] : [...dataByWeek],
    };
    const options = {
      scales: {
        y: {
          beginAtZero: true,
        },
      },
    };

    setChartData(data);
    setChartOptions(options);
  }, [searchByYear]);

  return (
    <div className="basis-1/2 border rounded-md">
      <div className="flex justify-between">
        <div>
          <div className="flex items-center justify-start gap-2">
            <input
              type="radio"
              name="account"
              onChange={() => setSearchByYear(true)}
              checked={searchByYear === true}
            />
            <p>Lọc theo năm</p>
          </div>
          <div className="flex items-center justify-start gap-2">
            <input
              type="radio"
              name="account"
              onChange={() => setSearchByYear(false)}
              checked={searchByYear === false}
            />
            <p>Lọc theo tuần</p>
          </div>
          <div className="flex justify-start">
            <Tooltip title="Xuất dữ liệu bảng ra excel">
              <p className="my-2 cursor-pointer text-green-800 text-3xl hover:text-green-500">
                <FontAwesomeIcon icon={faFileCsv} />
              </p>
            </Tooltip>
          </div>
        </div>

        <div className="flex flex-col gap-2">
          {searchByYear === false && (
            <div className="flex-1">
              <Tooltip title="Chọn thời gian tuần bạn muốn lọc">
                <select
                  onChange={(e) => setWeekTime(Number(e.target.value))}
                  className="border border-gray-300 p-1 outline-none rounded-md"
                >
                  {weekOptions.map((option, index) => {
                    return (
                      <option
                        key={index}
                        value={option}
                        selected={weekTime === index}
                      >
                        {option}
                      </option>
                    );
                  })}
                </select>
              </Tooltip>
            </div>
          )}
          <div className="flex-1">
            <Tooltip title="Chọn năm mà bạn muốn lọc">
              <select
                onChange={(e) => setYear(e.target.value)}
                className="w-full border border-gray-300 p-1 outline-none rounded-md"
              >
                {years().map((option, index) => {
                  return (
                    <option
                      key={index}
                      value={index}
                      selected={year === option}
                    >
                      {option}
                    </option>
                  );
                })}
              </select>
            </Tooltip>
          </div>
        </div>
      </div>

      <Chart type="bar" data={chartData} options={chartOptions} />
    </div>
  );
}
