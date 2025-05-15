import React, { useState, useEffect } from "react";
import { Trash2 } from "lucide-react";
import { PencilLine } from "lucide-react";
import { Copy } from "lucide-react";
import { X } from "lucide-react";
import toast from "react-hot-toast";
import { useTemplateStore } from "../stores/useTemplateStore";

const Template = ({ title, description, id, creatorId, category }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isToggleDelete, setIsToggleDelete] = useState(false);
  const [isToggleEdit, setIsToggleEdit] = useState(false);
  const { deleteTemplate, getUserById, username, categories, isLoading, updateTemplate } =
    useTemplateStore();

  useEffect(() => {
    const fetchUserName = async () => {
      await getUserById(creatorId);
    };
    fetchUserName();
  }, [getUserById, creatorId]);

  const [formData, setFormData] = useState({
    title: title,
    description: description,
    category: category,
    newCategory: "",
  });

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const categoryToUse = formData.newCategory || formData.category;

    updateTemplate(id, {
      title: formData.title,
      description: formData.description,
      category: categoryToUse,
    });

    editToggle();
  };

  const toggleOpen = () => {
    setIsOpen(!isOpen);
  };

  const deleteToggle = () => {
    setIsToggleDelete(!isToggleDelete);
  };

  const editToggle = () => {
    setIsToggleEdit(!isToggleEdit);
  };

  const copyToClipboard = async (text) => {
    try {
      await navigator.clipboard.writeText(text);
      toast.success("Text copied to clipboard!");
    } catch (err) {
      console.error("Failed to copy text: ", err);
    }
  };

  return (
    <div className=" border-b border-primary py-4 mr-5 relative">
      <button onClick={toggleOpen} className="flex justify-between items-center w-full text-left">
        <h3
          className={`text-xl font-medium "text-primary"
          break-words max-w-[calc(100%-1.5rem)]`}
        >
          {title}
        </h3>
        <span
          className={`transform transition-transform duration-300 ${
            isOpen ? "rotate-180" : "rotate-0"
          }`}
        >
          &#x25BC;
        </span>
      </button>
      {isOpen && (
        <>
          <div className="flex justify-between items-center mt-2">
            <p
              className="text-secondary cursor-pointer hover:text-yellow-500 break-words max-w-10/12 pl-4"
              onClick={() => copyToClipboard(description)}
            >
              {description}
            </p>
            <div className="flex flex-col sm:flex-row gap-5 mr-5 cursor-pointer">
              <PencilLine onClick={() => editToggle()} />
              <Copy onClick={() => copyToClipboard(description)} />
              <Trash2 onClick={() => deleteToggle()} />
            </div>
          </div>
          <div className="inline text-xs text-gray-700 mt-2 hover:text-lime-400 hover:animate-[wiggle_0.5s_ease-in-out_infinite]">{`Added by: ${username}`}</div>
        </>
      )}

      {isToggleDelete && (
        <div className="fixed inset-0 bg-black/10 backdrop-blur-sm z-50 flex items-center justify-center">
          <div className="flex flex-col gap-4 border-1 p-4 rounded shadow-lg relative w-full bg-base-200 min-w-1/4 max-w-9/12 items-center">
            <h2 className="text-lg font-bold">Are you sure you want to delete this template?</h2>
            <div className="flex gap-5">
              <button
                onClick={() => {
                  deleteTemplate(id);
                  setIsToggleDelete(false);
                }}
                className="btn btn-primary"
              >
                Yes
              </button>
              <button onClick={deleteToggle} className="btn btn-secondary">
                No
              </button>
            </div>
          </div>
        </div>
      )}

      {isToggleEdit && (
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
                Save
              </button>
            </form>
            <button
              className=" absolute top-2 right-2 text-gray-500 hover:text-gray-700 cursor-pointer"
              onClick={editToggle}
            >
              <X size={24} color="red" />
            </button>
          </div>
        </div>
      )}

      <div className="absolute right-0 bottom-0.5 text-xs text-primary mt-2 hover:text-info">
        {category}
      </div>
    </div>
  );
};

export default Template;
