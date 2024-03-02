// src/api.js
import axios from 'axios';

export const fetchCountries = async () => {
  try {
    const response = await axios.get('http://localhost:9000/country');
    return response.data; // ข้อมูลที่ได้จากการเรียก API จะอยู่ใน response.data
  } catch (error) {
    console.error("Fetching countries failed:", error);
    return [];
  }
};
