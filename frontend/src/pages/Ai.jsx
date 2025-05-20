import { useState } from "react";
import { axiosInstance } from "../lib/axios";
import toast from "react-hot-toast";
import { LoaderIcon } from "lucide-react";

const Ai = () => {
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");
  const [isLoading, setIsLoading] = useState(false)

  const enhanceGrammar = async () => {
    try {
      setIsLoading(true)
      const res = await axiosInstance.post("/template/grammarEnhance", { input });
      setOutput(res.data.aiResponse);
      toast.success("Grammar enhanced");
    } catch (error) {
      toast.error("AI.jsx error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen">
      <div className="max-w-3xl mx-auto p-6 bg-base-200 rounded-2xl shadow-lg mt-[5rem]">
        <h1 className="text-2xl font-bold text-primary mb-4">Grammar Enhancer</h1>

        <label className="label">
          <span className="label-text text-secondary pb-2">Enter your original text:</span>
        </label>
        <textarea
          className="textarea textarea-bordered w-full h-70 mb-4"
          placeholder="Type your sentence here..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
        ></textarea>

        <div className="flex flex-col">
          <button className="btn btn-primary mb-4" onClick={enhanceGrammar} disabled = {isLoading}>
           {isLoading ? <LoaderIcon className="animate-spin"/> : "Enhance Grammar"}
          </button>

          <label className="label">
            <span className="label-text text-accent">Enhanced Output:</span>
          </label>
        </div>

        <textarea
          className="textarea textarea-bordered w-full h-70"
          readOnly
          value={output}
          placeholder="Your improved sentence will appear here..."
        ></textarea>
      </div>
    </div>
  );
};

export default Ai;
