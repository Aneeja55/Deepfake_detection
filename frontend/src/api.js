import axios from "axios";

const API = axios.create({
  baseURL: process.env.REACT_APP_API_URL || "http://127.0.0.1:8001"
});

export const analyzeVideo = (formData) =>
  API.post("/analyze-video", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });