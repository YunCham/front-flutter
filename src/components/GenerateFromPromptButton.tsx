import React, { useState } from "react";
import { importDesign } from "../utils/importDesign";
import { useRoomStore } from "../features/rooms/store/useRoomStore";
import { FiSend } from "react-icons/fi";
import jsonFromPromptService from "../services/uiPromptGenerate";

const GenerateFromPromptButton: React.FC = () => {
  const [prompt, setPrompt] = useState("");
  const [loading, setLoading] = useState(false);
  const { setRoom } = useRoomStore();

  const cleanJson = (raw: string): string => {
    let cleaned = raw.trim();
    console.log(cleaned);
    if (cleaned.startsWith("```json")) cleaned = cleaned.replace(/^```json/, "").trim();
    if (cleaned.endsWith("```")) cleaned = cleaned.replace(/```$/, "").trim();
    return cleaned;
  };

  const handleGenerate = async () => {
    if (!prompt.trim()) return alert("Escribe un prompt primero.");
    setLoading(true);
    try {
      const rawJson = await jsonFromPromptService.generateJsonFromPrompt(prompt);
      const clean = cleanJson(rawJson);

      const blob = new Blob([clean], { type: "application/json" });
      const file = new File([blob], "generated.json", { type: "application/json" });

      const importedState = await importDesign(file);
      setRoom(importedState.room);
      alert("Diseño cargado desde descripción con éxito");
    } catch (err) {
      console.error("Error al generar UI desde texto:", err);
      alert("Hubo un error al generar el diseño.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col gap-2 w-full max-w-md">
      <textarea
        value={prompt}
        onChange={(e) => setPrompt(e.target.value)}
        placeholder="Describe la UI que deseas generar..."
        rows={4}
        className="w-full p-2 border border-gray-300 rounded-md resize-none"
      />
      <button
        onClick={handleGenerate}
        disabled={loading}
        className="flex items-center gap-2 self-start bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded transition"
      >
        <FiSend size={18} />
        {loading ? "Generando..." : "Generar UI desde texto"}
      </button>
    </div>
  );
};

export default GenerateFromPromptButton;
