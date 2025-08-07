import React from "react";
import { useState } from "react";
import { LoaderIcon, X, Plus, Sparkles } from "lucide-react";
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
    <div className="fixed inset-0 bg-black/30 backdrop-blur-md z-50 flex items-center justify-center p-3 sm:p-4 md:p-6">
      <div className="bg-base-100 rounded-xl sm:rounded-2xl shadow-2xl border border-base-300 w-full max-w-sm sm:max-w-md md:max-w-lg lg:max-w-xl xl:max-w-2xl relative overflow-hidden max-h-[95vh] sm:max-h-[90vh] flex flex-col">
        
        {/* Enhanced Header */}
        <div className="bg-gradient-to-r from-primary/10 to-secondary/10 p-3 sm:p-4 md:p-6 border-b border-base-200">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 sm:gap-3 min-w-0">
              <div className="w-8 h-8 sm:w-10 sm:h-10 bg-primary/20 rounded-full flex items-center justify-center shrink-0">
                <Sparkles className="w-4 h-4 sm:w-5 sm:h-5 text-primary" />
              </div>
              <div className="min-w-0">
                <h2 className="text-lg sm:text-xl md:text-2xl font-bold text-base-content truncate">Create New Template</h2>
                <p className="text-xs sm:text-sm text-base-content/60 mt-0.5 sm:mt-1 truncate">Share your knowledge with the community</p>
              </div>
            </div>
            <button
              className="btn btn-sm btn-circle btn-ghost hover:btn-error transition-all duration-200 shrink-0"
              onClick={onClose}
              aria-label="Close"
            >
              <X size={16} className="sm:w-5 sm:h-5" />
            </button>
          </div>
        </div>

        {/* Scrollable Form Content */}
        <div className="flex-1 overflow-y-auto p-3 sm:p-4 md:p-6">
          <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6">
            
            {/* Title Input */}
            <div className="form-control">
              <label className="label pb-1 sm:pb-2">
                <span className="label-text font-semibold text-sm sm:text-base flex items-center gap-1 sm:gap-2">
                  📝 <span className="truncate">Template Title</span>
                </span>
              </label>
              <input
                type="text"
                placeholder="Enter a descriptive title..."
                className="input input-bordered w-full focus:input-primary transition-all duration-200 text-sm sm:text-base"
                name="title"
                value={formData.title}
                onChange={handleChange}
                required
              />
            </div>

            {/* Category Select */}
            <div className="form-control">
              <label className="label pb-1 sm:pb-2">
                <span className="label-text font-semibold text-sm sm:text-base flex items-center gap-1 sm:gap-2">
                  🏷️ <span className="truncate">Category</span>
                </span>
              </label>
              <select
                name="category"
                className="select select-bordered w-full focus:select-primary transition-all duration-200 text-sm sm:text-base"
                value={formData.category}
                onChange={handleChange}
                required
              >
                <option value="" disabled>Choose a category...</option>
                {categories.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
                <option value="1">✨ Create new category</option>
              </select>
            </div>

            {/* New Category Input */}
            {formData.category === "1" && (
              <div className="form-control animate-in slide-in-from-top duration-300">
                <label className="label pb-1 sm:pb-2">
                  <span className="label-text font-semibold text-sm sm:text-base flex items-center gap-1 sm:gap-2">
                    🆕 <span className="truncate">New Category</span>
                  </span>
                </label>
                <input
                  type="text"
                  placeholder="Enter new category name..."
                  className="input input-bordered w-full focus:input-primary transition-all duration-200 text-sm sm:text-base"
                  name="newCategory"
                  value={formData.newCategory}
                  onChange={handleChange}
                  required
                />
              </div>
            )}

            {/* Description Textarea */}
            <div className="form-control">
              <label className="label pb-1 sm:pb-2">
                <span className="label-text font-semibold text-sm sm:text-base flex items-center gap-1 sm:gap-2">
                  📄 <span className="truncate">Template Content</span>
                </span>
              </label>
              <textarea
                placeholder="Write your template content here... This is what users will copy when they use your template."
                className="textarea textarea-bordered w-full h-32 sm:h-40 md:h-48 focus:textarea-primary transition-all duration-200 resize-none leading-relaxed text-sm sm:text-base"
                name="description"
                value={formData.description}
                onChange={handleChange}
                required
              ></textarea>
              <div className="label pt-1">
                <span className="label-text-alt text-xs opacity-60">
                  💡 Write clear, useful content for others to use
                </span>
              </div>
            </div>
          </form>
        </div>

        {/* Enhanced Footer */}
        <div className="bg-base-200/50 p-3 sm:p-4 md:p-6 border-t border-base-200">
          <div className="flex flex-col-reverse sm:flex-row gap-2 sm:gap-3 justify-end">
            <button
              type="button"
              className="btn btn-outline btn-sm sm:btn-md"
              onClick={onClose}
              disabled={isLoading}
            >
              Cancel
            </button>
            <button
              type="submit"
              form="template-form"
              className="btn btn-primary btn-sm sm:btn-md gap-2 shadow-lg hover:shadow-xl transition-all duration-200"
              disabled={isLoading || !formData.title.trim() || !formData.description.trim() || !formData.category}
              onClick={handleSubmit}
            >
              {isLoading ? (
                <>
                  <LoaderIcon className="animate-spin w-4 h-4 sm:w-5 sm:h-5" />
                  <span className="hidden xs:inline">Creating...</span>
                </>
              ) : (
                <>
                  <Plus className="w-4 h-4 sm:w-5 sm:h-5" />
                  <span className="hidden xs:inline">Create Template</span>
                  <span className="xs:hidden">Create</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Loading Overlay */}
        {isLoading && (
          <div className="absolute inset-0 bg-base-100/90 backdrop-blur-sm flex items-center justify-center z-10">
            <div className="text-center space-y-4">
              <div className="loading loading-spinner loading-lg text-primary"></div>
              <div>
                <p className="font-semibold text-lg">Creating your template...</p>
                <p className="text-sm opacity-60">This will only take a moment</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default TemplateForm;
