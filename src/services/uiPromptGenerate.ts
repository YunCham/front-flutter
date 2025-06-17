import api from "./api";

const jsonFromPromptService = {
  generateJsonFromPrompt: async (prompt: string): Promise<string> => {
    const response = await api.post("/generate/prompt", { prompt }, {
      headers: {
        "Content-Type": "application/json",
      },
      responseType: "text",
    });

    return response.data;
  },
};

export default jsonFromPromptService;
