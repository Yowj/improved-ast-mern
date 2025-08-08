import React, { useState, useEffect, memo } from "react";
import { Trash2, PencilLine, Copy, X } from "lucide-react";
import toast from "react-hot-toast";
import { useTemplateStore } from "../stores/useTemplateStore";

const Template = ({ title, description, id, creatorId, category }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isToggleDelete, setIsToggleDelete] = useState(false);
  const [isToggleEdit, setIsToggleEdit] = useState(false);
  const { deleteTemplate, getUserById, getUsernameById, categories, isLoading, updateTemplate } =
    useTemplateStore();

  const [username, setUsername] = useState("Loading...");

  useEffect(() => {
    const fetchUserName = async () => {
      const fetchedUsername = await getUserById(creatorId);
      setUsername(fetchedUsername);
    };
    
    // Check if username is already cached
    const cachedUsername = getUsernameById(creatorId);
    if (cachedUsername !== "Loading...") {
      setUsername(cachedUsername);
    } else {
      fetchUserName();
    }
  }, [getUserById, getUsernameById, creatorId]);

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
    setIsOpen(prev => !prev);
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
    <div className="border-b border-primary/20 py-3 relative">
      <button 
        onClick={toggleOpen} 
        className="flex justify-between items-center w-full text-left group"
      >
        <h3 className="text-xl font-medium text-primary break-words flex-1 group-hover:text-primary/80 transition-colors duration-200 pr-4">
          {title}
        </h3>
        <span className={`transform transition-transform duration-200 text-primary/60 shrink-0 ${isOpen ? "rotate-180" : "rotate-0"}`}>
          ▼
        </span>
      </button>
      
      {isOpen && (
        <div className="mt-3">
          <div className="flex justify-between items-start gap-4">
            <p
              className="text-secondary  cursor-pointer hover:text-accent break-words break-all flex-1 transition-colors duration-200 leading-relaxed text-sm lg:text-lg overflow-hidden"
              onClick={() => copyToClipboard(description)}
              title="Click to copy"
              style={{ wordWrap: 'break-word', overflowWrap: 'anywhere' }}
            >
              {description}
            </p>
            
            <div className="flex gap-2 shrink-0">
              <button
                onClick={() => editToggle()}
                className="btn btn-ghost btn-xs hover:btn-primary"
                title="Edit"
              >
                <PencilLine className="w-4 h-4" />
              </button>
              <button
                onClick={() => copyToClipboard(description)}
                className="btn btn-ghost btn-xs hover:btn-success"
                title="Copy"
              >
                <Copy className="w-4 h-4" />
              </button>
              <button
                onClick={() => deleteToggle()}
                className="btn btn-ghost btn-xs hover:btn-error"
                title="Delete"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>
          
          <div className="text-xs text-base-content/60 mt-2">
            Added by: {username}
          </div>
        </div>
      )}

      {isToggleDelete && (
        <div className="fixed inset-0 bg-black/30 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="flex flex-col gap-4 sm:gap-6 border border-base-300 p-4 sm:p-6 rounded-xl shadow-2xl relative w-full bg-base-100 max-w-sm sm:max-w-md items-center">
            <div className="text-center">
              <div className="w-12 h-12 bg-error/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <Trash2 className="w-6 h-6 text-error" />
              </div>
              <h2 className="text-lg sm:text-xl font-bold text-base-content mb-2">Delete Template</h2>
              <p className="text-sm sm:text-base text-base-content/70">Are you sure you want to delete this template? This action cannot be undone.</p>
            </div>
            <div className="flex flex-col-reverse sm:flex-row gap-3 w-full">
              <button onClick={deleteToggle} className="btn btn-outline btn-sm sm:btn-md flex-1">
                Cancel
              </button>
              <button
                onClick={() => {
                  deleteTemplate(id);
                  setIsToggleDelete(false);
                }}
                className="btn btn-error btn-sm sm:btn-md flex-1"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {isToggleEdit && (
        <div className="fixed inset-0 bg-black/30 backdrop-blur-sm z-50 flex items-center justify-center p-3 sm:p-4">
          <div className="flex flex-col gap-4 border border-base-300 p-4 sm:p-6 rounded-xl shadow-2xl relative w-full bg-base-100 max-w-sm sm:max-w-md lg:max-w-lg max-h-[95vh] overflow-y-auto">
            <div className="flex items-center justify-between">
              <h2 className="text-lg sm:text-xl font-bold text-base-content">Edit Template</h2>
              <button
                className="btn btn-sm btn-circle btn-ghost hover:btn-error"
                onClick={editToggle}
                aria-label="Close"
              >
                <X size={18} />
              </button>
            </div>
            
            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
              <div className="form-control">
                <label className="label">
                  <span className="label-text font-medium">Template Title</span>
                </label>
                <input
                  type="text"
                  placeholder="Template Title"
                  className="input input-bordered w-full text-sm sm:text-base focus:input-primary"
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  required
                />
              </div>
              
              <div className="form-control">
                <label className="label">
                  <span className="label-text font-medium">Category</span>
                </label>
                <select
                  name="category"
                  className="select select-bordered w-full text-sm sm:text-base focus:select-primary"
                  value={formData.category}
                  onChange={handleChange}
                  required
                >
                  <option value="">Select Category</option>
                  {categories.map((cat) => (
                    <option key={cat} value={cat}>
                      {cat}
                    </option>
                  ))}
                  <option value="1">Add new category</option>
                </select>
              </div>

              {formData.category === "1" && (
                <div className="form-control">
                  <label className="label">
                    <span className="label-text font-medium">New Category Name</span>
                  </label>
                  <input
                    type="text"
                    placeholder="Add your new category here"
                    className="input input-bordered w-full text-sm sm:text-base focus:input-primary"
                    name="newCategory"
                    value={formData.newCategory}
                    onChange={handleChange}
                    required
                  />
                </div>
              )}

              <div className="form-control">
                <label className="label">
                  <span className="label-text font-medium">Template Content</span>
                </label>
                <textarea
                  placeholder="Template Description"
                  className="textarea textarea-bordered w-full h-32 sm:h-40 text-sm sm:text-base focus:textarea-primary resize-none"
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  required
                ></textarea>
              </div>
              
              <div className="flex flex-col-reverse sm:flex-row gap-3">
                <button 
                  type="button"
                  onClick={editToggle}
                  className="btn btn-outline btn-sm sm:btn-md flex-1"
                  disabled={isLoading}
                >
                  Cancel
                </button>
                <button 
                  type="submit" 
                  className="btn btn-primary btn-sm sm:btn-md flex-1" 
                  disabled={isLoading}
                >
                  {isLoading ? "Saving..." : "Save Changes"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Category Badge */}
      <div className="absolute right-0 bottom-1 text-xs text-primary/70 hover:text-primary transition-colors duration-200">
        {category}
      </div>
    </div>
  );
};

export default memo(Template);
