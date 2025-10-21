
import { STORAGE_KEY, INITIAL_DATA } from '../constants';
import type { AppData } from '../types';

export const getData = (): AppData => {
  try {
    const rawData = window.localStorage.getItem(STORAGE_KEY);
    if (rawData) {
      // TODO: Add migration logic here if schema changes
      return JSON.parse(rawData);
    } else {
      // No data found, seed with initial data
      saveData(INITIAL_DATA);
      return INITIAL_DATA;
    }
  } catch (error) {
    console.error("Failed to load data from localStorage", error);
    // Return initial data as a fallback
    return INITIAL_DATA;
  }
};

export const saveData = (data: AppData) => {
  try {
    const dataString = JSON.stringify(data);
    window.localStorage.setItem(STORAGE_KEY, dataString);
  } catch (error) {
    console.error("Failed to save data to localStorage", error);
  }
};
