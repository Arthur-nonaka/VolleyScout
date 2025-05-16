import axios from "axios";
import dotenv from "dotenv";

dotenv.config();

axios.defaults.baseURL = process.env.NEXT_PUBLIC_URL ? `${process.env.NEXT_PUBLIC_URL}matches` : "http://127.0.0.1:5000/matches";


export const getMatches = async () => {
  try {
    const response = await axios.get("/");
    return response.data;
  } catch (error) {
    console.error("Error fetching matches:", error);
    throw error;
  }
};

export const createMatch = async (name: string, actions: string) => {
  try {
    const response = await axios.post("/", { name, actions });
    return response.data;
  } catch (error) {
    console.error("Error creating match:", error);
    throw error;
  }
};

export const updateMatch = async (
  id: string,
  name: string,
  actions: string
) => {
  try {
    const response = await axios.put(`/${id}`, { name, actions });
    return response.data;
  } catch (error) {
    console.error("Error updating match:", error);
    throw error;
  }
};

export const deleteMatch = async (id: string) => {
  try {
    const response = await axios.delete(`/${id}`);
    return response.data;
  } catch (error) {
    console.error("Error deleting match:", error);
    throw error;
  }
};

export const getMatchById = async (id: string) => {
  try {
    const response = await axios.get(`/${id}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching match by ID:", error);
    throw error;
  }
};
