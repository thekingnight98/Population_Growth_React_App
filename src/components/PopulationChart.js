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
  const yearsRange = Array.from({ length: 2022 - 1950 }, (_, i) => 1950 + i);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetchCountries();
        console.log("response data==>", response);
        setData(response); 
      } catch (error) {
        console.log(error);
      }
    };

    setChartOptions({
      animation: {
        duration: 500, // ระยะเวลาของ animation เป็น milliseconds
        easing: "easeInOutQuart", // ประเภทของการเปลี่ยนแปลง animation
      },
      indexAxis: "y",
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
          ticks: {
            // แสดงแต่ละปีบนแกน X
            callback: function (value, index, values) {
              return yearsRange[index];
            },
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
    if (data.length > 0) {
      const processedData = processChartData(data, currentYear);
      updateChartDataSmoothly(processedData);
    }
  }, [data, currentYear]);

  const updateChartDataSmoothly = (newData) => {
    setChartData(prevChartData => {
      if (prevChartData.datasets.length > 0) {
        const updatedDatasets = prevChartData.datasets.map((dataset, index) => {
          return {
            ...dataset, // รักษาค่าที่มีอยู่ใน dataset (รวมถึง backgroundColor, borderColor)
            data: newData.datasets[index]?.data || [], // อัปเดตข้อมูลใหม่
          };
        });
  
        return {
          ...prevChartData,
          labels: newData.labels, // อัปเดต labels ใหม่
          datasets: updatedDatasets,
        };
      } else {
        // ถ้าไม่มี datasets มาก่อน, ใช้ newData ที่สร้างมาใหม่
        return newData;
      }
    });
  };
  

  function processChartData(data, year) {
    const sortedData = data
      .filter((item) => parseInt(item["Year"]) === year)
      .sort((a, b) => b.Population - a.Population)
      .slice(0, 12);
  
    const labels = sortedData.map((item) => item["Country name"]);
    const populationData = sortedData.map((item) => parseInt(item["Population"]));
  
    return {
      labels: labels,
      datasets: [{
        label: `Population in ${year}`,
        data: populationData,
        backgroundColor: "rgba(53, 162, 235, 0.5)",
        borderColor: "rgb(53, 162, 235)",
        borderWidth: 1,
      }],
    };
  }

  const startAnimation = () => {
    let year = 1950;
    const intervalId = setInterval(() => {
      if (year > 2021) {
        clearInterval(intervalId);
      } else {
        setCurrentYear(year);
        const processedData = processChartData(data, year);
        updateChartDataSmoothly(processedData);
        year++;
      }
    }, 500); 
  };

  return (
    <div className="container">
      <Bar data={chartData} options={chartOptions} />
      <button
        className="!bg-gray-500 text-white font-semibold py-4
      rounded-md px-2
      "
        onClick={startAnimation}
      >
        Start Animation
      </button>
      <h1>{currentYear}</h1>
    </div>
  );
};

export default PopulationChart;