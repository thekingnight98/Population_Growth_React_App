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
import ChartDataLabels from "chartjs-plugin-datalabels";
import { fetchCountries } from "../api";
import { FaPlay, FaPause, FaCaretDown } from "react-icons/fa";
import { FaSquare } from "react-icons/fa6";

Chart.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ChartDataLabels
);

const asiaCountries = [
  "Afghanistan",
  "Armenia",
  "Azerbaijan",
  "Bangladesh",
  "Bhutan",
  "Brunei",
  "Myanmar",
  "Cambodia",
  "China",
  "Cyprus",
  "Georgia",
  "India",
  "Indonesia",
  "Iraq",
  "Iran",
  "Israel",
  "Japan",
  "Jordan",
  "Kazakhstan",
  "Kuwait",
  "Kyrgyzstan",
  "Laos",
  "Lebanon",
  "Malaysia",
  "Maldives",
  "Mongolia",
  "Nepal",
  "Oman",
  "Pakistan",
  "Palestine",
  "Philippines",
  "Qatar",
  "Russia",
  "Saudi Arabia",
  "Singapore",
  "Sri Lanka",
  "South Korea",
  "North Korea",
  "Thailand",
  "Timor-Leste",
  "Turkey",
  "Turkmenistan",
  "United Arab Emirates",
  "Uzbekistan",
  "Vietnam",
  "Yemen",
];

const europeCountries = [
  "Albania",
  "Andorra",
  "Armenia",
  "Austria",
  "Azerbaijan",
  "Belarus",
  "Belgium",
  "Bosnia and Herzegovina",
  "Bulgaria",
  "Croatia",
  "Cyprus",
  "Czech Republic",
  "Denmark",
  "Estonia",
  "Finland",
  "France",
  "Georgia",
  "Germany",
  "Greece",
  "Hungary",
  "Iceland",
  "Ireland",
  "Italy",
  "Kazakhstan",
  "Kosovo",
  "Latvia",
  "Liechtenstein",
  "Lithuania",
  "Luxembourg",
  "Malta",
  "Moldova",
  "Monaco",
  "Montenegro",
  "Netherlands",
  "North Macedonia",
  "Norway",
  "Poland",
  "Portugal",
  "Romania",
  "Russia",
  "San Marino",
  "Serbia",
  "Slovakia",
  "Slovenia",
  "Spain",
  "Sweden",
  "Switzerland",
  "Turkey",
  "Ukraine",
  "United Kingdom",
  "Vatican City",
];

const americasCountries = [
  "Antigua and Barbuda",
  "Argentina",
  "Bahamas",
  "Barbados",
  "Belize",
  "Bolivia",
  "Brazil",
  "Canada",
  "Chile",
  "Colombia",
  "Costa Rica",
  "Cuba",
  "Dominica",
  "Dominican Republic",
  "Ecuador",
  "El Salvador",
  "Grenada",
  "Guatemala",
  "Guyana",
  "Haiti",
  "Honduras",
  "Jamaica",
  "Mexico",
  "Nicaragua",
  "Panama",
  "Paraguay",
  "Peru",
  "Saint Kitts and Nevis",
  "Saint Lucia",
  "Saint Vincent and the Grenadines",
  "Suriname",
  "Trinidad and Tobago",
  "United States",
  "Uruguay",
  "Venezuela",
];
const OceaniaCountries = [
  "Australia",
  "Fiji",
  "Kiribati",
  "Marshall Islands",
  "Micronesia",
  "Nauru",
  "New Zealand",
  "Palau",
  "Papua New Guinea",
  "Samoa",
  "Solomon Islands",
  "Tonga",
  "Tuvalu",
  "Vanuatu",
];

const PopulationChart = () => {
  const [chartData, setChartData] = useState({
    datasets: [],
  });
  const [chartOptions, setChartOptions] = useState({});
  const [currentYear, setCurrentYear] = useState(1950);
  const [data, setData] = useState([]);
  const yearsRange = Array.from({ length: 2022 - 1950 }, (_, i) => 1950 + i);
  const [isPlaying, setIsPlaying] = useState(false);
  const [worldPopulationByYear, setWorldPopulationByYear] = useState({});
  const [worldPopulation, setWorldPopulation] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  // progrees bar
  const [pointerPosition, setPointerPosition] = useState(0);
  const progressWidth = 100; // หรือค่าที่คำนวณได้ตามความคืบหน้า

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetchCountries();
        console.log("response data==>", response);
        setData(response);
        setIsLoading(false);

        // สร้าง object สำหรับเก็บจำนวนประชากร 'world' โดยแยกตามปี
        const worldDataByYear = response
          .filter(
            (country) => country["Country name"].toLowerCase() === "world"
          )
          .reduce((acc, curr) => {
            acc[curr.Year] = curr.Population;
            return acc;
          }, {});

        setWorldPopulationByYear(worldDataByYear);
        // ตั้งค่าประชากร 'world' สำหรับปีปัจจุบัน
        setWorldPopulation(worldDataByYear[currentYear] || 0);
      } catch (error) {
        console.log(error);
        setIsLoading(false);
      }
    };

    setChartOptions({
      animation: {
        duration: 500,
        easing: "easeInOutQuart",
      },
      indexAxis: "y",
      scales: {
        y: {
          title: {
            display: false,
            text: "Country",
          },
        },
        x: {
          position: "top",
          title: {
            display: false,
            text: "Population",
          },
          ticks: {
            // แสดงแต่ละปีบนแกน X
            callback: function (value, index, values) {
              return value.toLocaleString(); // แปลงค่าเป็น string ที่มี comma
            },
          },
        },
      },
      responsive: true,
      plugins: {
        legend: {
          display: false,
        },
        title: {
          display: false,
          text: "Population Growth Per Country, 1950 to 2021",
        },
        datalabels: {
          align: "end",
          anchor: "end",
          color: "#666",
          font: {
            weight: "bold",
          },
          formatter: function (value, context) {
            return value.toLocaleString(); // แปลงค่าเป็น string ที่มี comma
          },
        },
      },
    });
    fetchData();
  }, []);

  useEffect(() => {
    // อัปเดตจำนวนประชากร 'world' ตามปีปัจจุบัน
    setWorldPopulation(worldPopulationByYear[currentYear] || 0);
  }, [currentYear, worldPopulationByYear]);

  useEffect(() => {
    if (data.length > 0) {
      const processedData = processChartData(data, currentYear);
      updateChartDataSmoothly(processedData);
    }
  }, [data, currentYear]);

  const updateChartDataSmoothly = (newData) => {
    setChartData((prevChartData) => {
      if (prevChartData.datasets.length > 0) {
        const updatedDatasets = prevChartData.datasets.map((dataset, index) => {
          return {
            ...dataset,
            data: newData.datasets[index]?.data || [],
          };
        });

        return {
          ...prevChartData,
          labels: newData.labels,
          datasets: updatedDatasets,
        };
      } else {
        return newData;
      }
    });
  };

  function processChartData(data, year) {
    // รายการชื่อที่ไม่ต้องการแสดงบนกราฟ, แปลงเป็นตัวพิมพ์เล็กเพื่อง่ายต่อการเปรียบเทียบ
    const excludeNames = ["world"].map((name) => name.toLowerCase());
    const excludePrefixes = [
      "less",
      "upper",
      "lower",
      "high",
      "asia",
      "more",
      "world",
      "asia",
      "europe",
      "africa",
      "least",
      "latin",
      "low",
      "northern",
      "land",
    ].map((prefix) => prefix.toLowerCase());

    const filteredData = data
      .filter((item) => {
        const itemNameLowercase = item["Country name"].toLowerCase(); // แปลงชื่อในข้อมูลเป็นตัวพิมพ์เล็ก
        // ตรวจสอบว่าชื่อไม่ตรงกับรายการชื่อที่ไม่ต้องการ และไม่ขึ้นต้นด้วยคำนำหน้าที่ไม่ต้องการ
        const isExcludedName = excludeNames.includes(itemNameLowercase);
        const isExcludedPrefix = excludePrefixes.some((prefix) =>
          itemNameLowercase.startsWith(prefix)
        );
        return !isExcludedName && !isExcludedPrefix;
      })
      .filter((item) => parseInt(item["Year"]) === year)
      .sort((a, b) => b["Population"] - a["Population"])
      .slice(0, 12);

    const labels = filteredData.map((item) => item["Country name"]);
    const populationData = filteredData.map((item) =>
      parseInt(item["Population"])
    );

    const backgroundColors = labels.map((label) => {
      if (asiaCountries.includes(label)) return "#6600FF"; // Asia
      if (europeCountries.includes(label)) return "#6666FF"; // Europe
      if (americasCountries.includes(label)) return "#FFCC33"; // Americas
      if (OceaniaCountries.includes(label)) return "#CC6633"; // Oceania
      return "#6666FF"; // Default color
    });

    return {
      labels: labels,
      datasets: [
        {
          label: "",
          data: populationData,
          backgroundColor: backgroundColors,
          borderColor: backgroundColors,
          borderWidth: 1,
        },
      ],
    };
  }

  const toggleAnimation = () => {
    if (currentYear >= 2021) {
      setCurrentYear(1950); // รีเซ็ตปีกลับไปเป็นปีเริ่มต้น
      setWorldPopulation(worldPopulationByYear[1950] || 0);
    }
    setIsPlaying(!isPlaying);
  };

  useEffect(() => {
    let intervalId;

    if (isPlaying) {
      intervalId = setInterval(() => {
        setCurrentYear((year) => {
          if (year >= 2021) {
            setIsPlaying(false);
            clearInterval(intervalId);
            return year;
          } else {
            const newYear = year + 1;
            const position = ((newYear - 1950) / (2021 - 1950)) * 100;
            setPointerPosition(position); // อัปเดตตำแหน่งลูกศร
            return newYear;
          }
        });
      }, 300);
    } else {
      clearInterval(intervalId);
    }

    return () => clearInterval(intervalId); // คืนค่าเมื่อ component unmount
  }, [isPlaying, data]);

  if (isLoading) {
    return (
      <div className="container text-center">
        กำลัง Loading API โปรดรอประมาณ 18 วินาที...
      </div>
    );
  }

  return (
    <div className="container max-w-screen-lg">
      <div>
        <div className="text-bold text-xl text-black">
          Population growth per country, 1950 to 2021
        </div>
        <div className="text-xl text-gray-500">
          Click on the legend bellow to filter by continent
        </div>
        <div className="md:flex lg:flex items-center gap-2">
          <div className="text-bold text-xl text-gray-800">Region</div>
          <div className="flex items-center gap-2 justify-center ">
            <FaSquare color="#6600FF" />
            Asia
          </div>
          <div className="flex items-center gap-2 justify-center">
            <FaSquare color="#6666FF" />
            Europe
          </div>
          <div className="flex items-center gap-2 justify-center">
            <FaSquare color="#CC66FF" />
            Africa
          </div>
          <div className="flex items-center gap-2 justify-center">
            <FaSquare color="#CC6633" />
            Oceania
          </div>
          <div className="flex items-center gap-2 justify-center">
            <FaSquare color="#FFCC33" />
            Amercas
          </div>
        </div>
      </div>
      <Bar
        className="mt-4 max-w-screen-lg"
        data={chartData}
        options={chartOptions}
      />

      <div className="flex items-center space-x-6 pl-20">
        <button
          className="w-8 h-8 flex items-center justify-center bg-gray-500 text-white font-semibold rounded-full"
          onClick={toggleAnimation}
        >
          {isPlaying ? <FaPause /> : <FaPlay />}
        </button>

        {/* Progress bar container */}
        <div className="relative flex-1 h-4 bg-gray-200 rounded-full overflow-hidden">
          {/* Progress bar */}
          <div
            className="absolute top-0 bottom-0 bg-gray-400"
            style={{ width: `${progressWidth}%` }}
          ></div>
          {/* Pointer */}
          <div
            className="absolute"
            style={{ left: `calc(${pointerPosition}% - 0.75rem)` }} // Adjust for icon width to center
          >
            <FaCaretDown
              className="text-gray-800"
              size={24}
              style={{ marginTop: "-0.5rem" }}
            />
          </div>
        </div>
      </div>

      {/* Year labels */}
      <div className="flex justify-between px-20 mt-2 text-xs text-black">
        {yearsRange.map((year, index) =>
          year % 4 === 0 ? (
            <span key={index} className="whitespace-nowrap">
              {year}
            </span>
          ) : null
        )}
      </div>

      <div
        className="absolute text-right 
      top-[400px] w-[400px] bg-transparent] right-[28%] md:right-[25%]"
      >
        <div className="">
          <div className="text-6xl font-bold text-gray-400">
            <span>{currentYear}</span>
          </div>
          <div className="text-4xl font-bold text-gray-400 mt-2">
            Total: <span> {Number(worldPopulation).toLocaleString()}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PopulationChart;
