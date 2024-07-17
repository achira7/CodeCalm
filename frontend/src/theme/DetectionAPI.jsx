import axios from "axios";

export const fetchEmotionData = async (id, period) => {
    try {
      const response = await axios.get("http://localhost:8000/api/emotions", {
        params: {
          user_id: id,
          period: period
        },
      });
      return {
        defaultEmotionValues: response.data.defaultEmotionValues,
        hourlyDominantEmotions: response.data.hourlyDominantEmotions,
      };
    } catch (error) {
      console.error("Error fetching emotion data:", error);
      throw error;
    }
  };


  export const fetchStressData = async (id, period) => {
    try {
      const response = await axios.get("http://localhost:8000/api/stress", {
        params: {
          user_id: id,
          period: period
        },
      });
      return {
        defaultEmotionValues: response.data.defaultEmotionValues,
        hourlyDominantEmotions: response.data.hourlyDominantEmotions,
      };
    } catch (error) {
      console.error("Error fetching emotion data:", error);
      throw error;
    }
  };