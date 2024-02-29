import React, { useEffect, useState } from "react";
import { Bar } from "react-chartjs-2";
import {
  Chart,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { fetchCountries } from "../api";

Chart.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const PopulationChart = () => {
  const [chartData, setChartData] = useState({
    datasets: [],
  });
  const [chartOptions, setChartOptions] = useState({});
  const [currentYear, setCurrentYear] = useState(1950);
  const [data, setData] = useState([]); // สมมติว่านี่คือข้อมูลที่ได้จาก API

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetchCountries(); // ตรวจสอบว่า fetchCountries คือ async function
        console.log("response data==>", response);
        setData(response); // อาจต้องปรับเปลี่ยนตามโครงสร้างข้อมูลที่ response ส่งกลับมา
      } catch (error) {
        console.log(error);
      }
    };
    setChartOptions({
      indexAxis: "y", // แกน Y เป็นแกนหลักสำหรับกราฟแนวนอน
      scales: {
        y: {
          title: {
            display: true,
            text: "Country",
          },
        },
        x: {
          title: {
            display: true,
            text: "Population",
          },
        },
      },
      responsive: true,
      plugins: {
        legend: {
          position: "top",
        },
        title: {
          display: true,
          text: "Population Growth Per Country, 1950 to 2021",
        },
      },
    });
    fetchData();
  }, []);

  useEffect(() => {
    const filteredData = data.filter(
      (item) => parseInt(item["Year"]) === currentYear
    );
    if (filteredData.length > 0) {
      const processedData = processChartData(filteredData);
      setChartData(processedData);
    }
  }, [currentYear, data]);

  function processChartData(filteredData) {
    const labels = filteredData.map((item) => item["Country name"]);
    const populationData = filteredData.map((item) =>
      parseInt(item["Population"])
    );

    return {
      labels,
      datasets: [
        {
          label: "Population",
          data: populationData,
          backgroundColor: "rgba(53, 162, 235, 0.5)",
          borderColor: "rgb(53, 162, 235)",
          borderWidth: 1,
        },
      ],
    };
  }

  const startAnimation = () => {
    let year = 1950;
    const intervalId = setInterval(() => {
      if (year > 2021) {
        clearInterval(intervalId);
      } else {
        setCurrentYear(year);
        year++;
      }
    }, 500); // ตั้งค่าเวลาตามความเร็วที่คุณต้องการ
  };

  return (
    <div>
      <Bar data={chartData} options={chartOptions} />
      <button 
      className="!bg-gray-500 text-white font-semibold py-4
      rounded-md px-2
      " 
      onClick={startAnimation}>Start Animation</button>
    </div>
  );
};

export default PopulationChart;
