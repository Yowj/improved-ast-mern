import React from "react";
import { useState } from "react";
import { X } from "lucide-react";
import { useTemplateStore } from "../stores/useTemplateStore";

const TemplateForm = ({ onClose }) => {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    category: "",
    newCategory: "",
  });

  const { isLoading, createTemplate, categories } = useTemplateStore();

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const categoryToUse = formData.category === "1" ? formData.newCategory : formData.category;

    createTemplate({
      title: formData.title,
      description: formData.description,
      category: categoryToUse,
    });

    setFormData({
      title: "",
      description: "",
      category: "",
      newCategory: "",
    });

    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/10 backdrop-blur-sm z-50 flex items-center justify-center">
      <div className="flex flex-col gap-4 border-1 p-4 rounded shadow-lg relative w-full bg-base-200 max-w-2/4">
        <h2 className="text-lg font-bold">Create New Template</h2>
        <form onSubmit={handleSubmit} className="flex flex-col gap-2">
          <input
            type="text"
            placeholder="Template Title"
            className="input input-bordered w-full mt-2"
            name="title"
            value={formData.title}
            onChange={handleChange}
          />
          <select
            name="category"
            className="select select-bordered w-full mt-2"
            value={formData.category}
            onChange={handleChange}
          >
            <option value="">Select Category</option>
            {categories.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
            <option value="1">Add new category</option>
          </select>

          {formData.category === "1" && (
            <input
              type="text"
              placeholder="Add your new category here"
              className="input input-bordered w-full mt-2"
              name="newCategory"
              value={formData.newCategory}
              onChange={handleChange}
            />
          )}

          <textarea
            placeholder="Template Description"
            className="textarea textarea-bordered w-full mt-2"
            rows="10"
            name="description"
            value={formData.description}
            onChange={handleChange}
          ></textarea>
          <button type="submit" className="btn btn-primary mt-2" disabled={isLoading}>
            Create
          </button>
        </form>
        <button
          className=" absolute top-2 right-2 text-gray-500 hover:text-gray-700 cursor-pointer"
          onClick={onClose}
        >
          <X size={24} color="red" />
        </button>
      </div>
    </div>
  );
};

export default TemplateForm;
