import { useState } from "react";
import React from "react";
import TemplateForm from "../components/TemplateForm";
import TemplatesContainer from "../components/TemplatesContainer";
import { useTemplateStore } from "../stores/useTemplateStore";
import { Plus, Search } from "lucide-react";
import OnlineUsers from "../components/OnlineUsers";

const Home = () => {
  const [isOpen, setIsOpen] = useState(false);


  const { categories, selectedCategory, setSelectedCategory, setSearchTerm, searchTerm } =
    useTemplateStore();

  const toggleOpen = () => {
    setIsOpen(!isOpen);
  };

  const clearAll = () => {
    setSelectedCategory("");
    setSearchTerm("");
  };

  return (
    <div className="flex bg-base-100 mb-10 min-h-[calc(100vh-7rem)]">
      {/* Responsive Sidebar */}
      <aside className="hidden lg:flex sticky top-1 flex-col h-[calc(100vh-4rem)] w-72 xl:w-80 shrink-0">
        <div className="flex flex-col items-center p-4 xl:p-5">
          {/* Show All Templates Button */}
          <div className="btn btn-primary w-full mb-4" onClick={clearAll}>
            Show All Templates
          </div>

          {/* Create Template Button - Prominently placed */}
          <div
            className="btn btn-secondary w-full mb-6 gap-2 shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300 group border-2 border-secondary/30"
            onClick={toggleOpen}
          >
            <Plus className="w-4 h-4 group-hover:rotate-90 transition-transform duration-300" />
            Create New Template
          </div>
          
          {/* Categories Section */}
          <div className="w-full">
            <div className="mb-4 font-semibold text-base-content text-center">Categories</div>
            <div className="grid xl:grid-cols-2 grid-cols-1 gap-3 w-full">
              {categories.map((category) => (
                <div
                  key={category}
                  className={`btn w-full border-2 border-secondary hover:bg-accent hover:text-base-100 transition-all duration-200 ${
                    selectedCategory === category ? "bg-accent text-base-100" : ""
                  }`}
                  onClick={() => {
                    setSelectedCategory(category);
                    setSearchTerm("");
                  }}
                >
                  <span className="truncate block w-full">{category}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Mobile Header */}
        <div className="lg:hidden bg-base-200/50 border-b border-base-300 p-3 sticky top-0 z-30">
          <div className="flex gap-2 mb-3">
            <button className="btn btn-primary btn-sm flex-1" onClick={clearAll}>
              All Templates
            </button>
            <button 
              className="btn btn-secondary btn-sm flex-1 gap-1 shadow-md" 
              onClick={toggleOpen}
            >
              <Plus className="w-4 h-4" />
              Create
            </button>
          </div>
          
          {/* Mobile Categories */}
          <div className="flex gap-2 overflow-x-auto pb-2">
            {categories.slice(0, 5).map((category) => (
              <button
                key={category}
                className={`btn btn-xs whitespace-nowrap ${
                  selectedCategory === category ? "btn-accent" : "btn-ghost"
                }`}
                onClick={() => {
                  setSelectedCategory(category);
                  setSearchTerm("");
                }}
              >
                {category}
              </button>
            ))}
            {categories.length > 5 && (
              <button className="btn btn-xs btn-ghost opacity-50">
                +{categories.length - 5} more
              </button>
            )}
          </div>
        </div>

        {/* Search and Content */}
        <main className="flex-1 p-3 sm:p-4 lg:p-6">
          {/* Search Bar */}
          <div className="flex items-center relative mb-4">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-base-content/50 z-10" size={18} />
            <input
              type="text"
              name="searchTerm"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search templates..."
              className="input input-bordered w-full pl-10 focus:input-primary"
            />
          </div>
          
          <TemplatesContainer toggleOpen={toggleOpen} />
        </main>
      </div>

      {/* Floating Action Button - Mobile/Tablet */}
      <div className="lg:hidden fixed bottom-6 right-6 z-40">
        <button
          className="btn btn-secondary btn-circle w-16 h-16 shadow-2xl hover:shadow-secondary/25 hover:scale-110 transition-all duration-300 group border-2 border-secondary/30"
          onClick={toggleOpen}
          aria-label="Create new template"
        >
          <Plus className="w-7 h-7 group-hover:rotate-180 transition-transform duration-500" />
        </button>
      </div>

      {isOpen && <TemplateForm onClose={toggleOpen} />}
      <OnlineUsers />
    </div>
  );
};

export default Home;
