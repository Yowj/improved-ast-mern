import { useState } from "react";
import React from "react";
import TemplateForm from "../components/TemplateForm";
import TemplatesContainer, { usePaginationData } from "../components/TemplatesContainer";
import { useTemplateStore } from "../stores/useTemplateStore";
import { Plus, Search, X } from "lucide-react";
import OnlineUsers from "../components/OnlineUsers";

const Home = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const templatesPerPage = 11;

  const { categories, selectedCategory, setSelectedCategory, setSearchTerm, searchTerm, templates, filteredTemplates, searchedTemplates } =
    useTemplateStore();
  
  const { displayTemplates, totalPages, hasMultiplePages } = usePaginationData(
    templates, filteredTemplates, searchTerm, searchedTemplates, templatesPerPage
  );

  const toggleOpen = () => {
    setIsOpen(!isOpen);
  };

  const clearAll = () => {
    setSelectedCategory("");
    setSearchTerm("");
    setCurrentPage(1);
  };

  // Generate page numbers for pagination
  const generatePageNumbers = () => {
    const pages = [];
    const isMobile = typeof window !== 'undefined' && window.innerWidth < 640;
    const delta = isMobile ? 1 : 2;
    
    const start = Math.max(1, currentPage - delta);
    const end = Math.min(totalPages, currentPage + delta);
    
    if (start > 1) {
      pages.push(1);
      if (start > 2) {
        pages.push('...');
      }
    }
    
    for (let i = start; i <= end; i++) {
      pages.push(i);
    }
    
    if (end < totalPages) {
      if (end < totalPages - 1) {
        pages.push('...');
      }
      pages.push(totalPages);
    }
    
    return pages;
  };

  return (
    <div className="flex bg-base-100 min-h-[calc(100vh-8rem)] sm:min-h-[calc(100vh-7rem)] pb-4 sm:pb-10">
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
        {/* Enhanced Mobile Header */}
        <div className="lg:hidden bg-base-200/80 backdrop-blur-sm border-b border-base-300 p-3 sm:p-4 sticky top-0 z-30 shadow-sm">
          <div className="flex gap-2 sm:gap-3 mb-3">
            <button className="btn btn-primary btn-sm sm:btn-md flex-1 shadow-sm" onClick={clearAll}>
              <span className="truncate">All Templates</span>
            </button>
            <button 
              className="btn btn-secondary btn-sm sm:btn-md flex-1 gap-1 sm:gap-2 shadow-sm" 
              onClick={toggleOpen}
            >
              <Plus className="w-4 h-4" />
              <span className="hidden xs:inline">Create</span>
              <span className="xs:hidden">+</span>
            </button>
          </div>
          
          {/* Enhanced Mobile Categories */}
          <div className="flex gap-1.5 sm:gap-2 overflow-x-auto pb-2 ">
            {categories.map((category) => (
              <button
                key={category}
                className={`btn btn-xs sm:btn-sm whitespace-nowrap px-2 sm:px-3 ${
                  selectedCategory === category 
                    ? "btn-accent shadow-md" 
                    : "btn-ghost hover:btn-neutral"
                }`}
                onClick={() => {
                  setSelectedCategory(category);
                  setSearchTerm("");
                }}
              >
                {category}
              </button>
            ))}
          
          </div>
        </div>

        {/* Search and Content */}
        <main className="flex-1 p-3 sm:p-4 lg:p-6 pb-20 lg:pb-4">
          {/* Enhanced Search Bar */}
          <div className="flex items-center relative mb-4 sm:mb-6">
            <Search className="absolute left-3 sm:left-4 top-1/2 transform -translate-y-1/2 text-base-content/50 z-10" size={16} />
            <input
              type="text"
              name="searchTerm"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search templates..."
              className="input input-bordered input-sm sm:input-md w-full pl-9 sm:pl-12 pr-3 sm:pr-4 focus:input-primary transition-all duration-200 text-sm sm:text-base"
            />
            {searchTerm && (
              <button
                className="absolute right-2 sm:right-3 top-1/2 transform -translate-y-1/2 btn btn-ghost btn-xs btn-circle"
                onClick={() => setSearchTerm("")}
              >
                <X size={14} />
              </button>
            )}
          </div>
          
          <TemplatesContainer 
            toggleOpen={toggleOpen} 
            currentPage={currentPage} 
            setCurrentPage={setCurrentPage}
            templatesPerPage={templatesPerPage}
          />
          
          {/* Pagination - Better positioned at bottom of content */}
          {hasMultiplePages && (
            <div className="flex justify-center items-center gap-2 py-6 mt-8">
              <button 
                className={`btn btn-sm btn-circle ${currentPage === 1 ? 'btn-disabled' : 'btn-ghost'}`}
                onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
              >
                ‹
              </button>
              
              <div className="join">
                {generatePageNumbers().map((page, index) => {
                  if (page === '...') {
                    return (
                      <span key={`ellipsis-${index}`} className="join-item btn btn-sm btn-disabled">
                        ...
                      </span>
                    );
                  }
                  
                  return (
                    <button
                      key={page}
                      className={`join-item btn btn-sm ${
                        currentPage === page ? 'btn-primary' : 'btn-ghost'
                      }`}
                      onClick={() => setCurrentPage(page)}
                    >
                      {page}
                    </button>
                  );
                })}
              </div>
              
              <button 
                className={`btn btn-sm btn-circle ${currentPage === totalPages ? 'btn-disabled' : 'btn-ghost'}`}
                onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                disabled={currentPage === totalPages}
              >
                ›
              </button>
            </div>
          )}
        </main>
      </div>

      {/* Enhanced Floating Action Button - Mobile/Tablet */}
      <div className="lg:hidden fixed bottom-4 sm:bottom-6 right-4 sm:right-6 z-40">
        <button
          className="btn btn-secondary btn-circle w-14 h-14 sm:w-16 sm:h-16 shadow-2xl hover:shadow-secondary/25 hover:scale-110 transition-all duration-300 group border-2 border-secondary/20 active:scale-95"
          onClick={toggleOpen}
          aria-label="Create new template"
        >
          <Plus className="w-6 h-6 sm:w-7 sm:h-7 group-hover:rotate-180 transition-transform duration-500" />
        </button>
      </div>

      {isOpen && <TemplateForm onClose={toggleOpen} />}
      <OnlineUsers />
    </div>
  );
};

export default Home;
