import React, { useEffect, useState } from "react";
import Template from "./Template";
import { useTemplateStore } from "../stores/useTemplateStore";
import { motion, AnimatePresence } from "framer-motion";

const TemplatesContainer = ({ toggleOpen }) => {
  const { templates, filteredTemplates, searchTerm, searchedTemplates, setSelectedCategory } =
    useTemplateStore();
    
  // Pagination states
  const [currentPage, setCurrentPage] = useState(1);
  const templatesPerPage = 11; // Adjust kung ilan gusto mo per page

  let displayTemplates = templates;

  if (searchTerm.length > 0) {
    displayTemplates = searchedTemplates;
  }

  if (filteredTemplates.length > 0 && searchTerm.length === 0) {
    displayTemplates = filteredTemplates;
  }

  // Calculate pagination
  const indexOfLastTemplate = currentPage * templatesPerPage;
  const indexOfFirstTemplate = indexOfLastTemplate - templatesPerPage;
  const currentTemplates = displayTemplates.slice(indexOfFirstTemplate, indexOfLastTemplate);
  const totalPages = Math.ceil(displayTemplates.length / templatesPerPage);

  // Reset to page 1 when search term or filter changes
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, filteredTemplates]);

  useEffect(() => {
    if (searchTerm.length > 0) {
      setSelectedCategory("");
    }
  }, [searchTerm, setSelectedCategory]);

  // Helper function to generate page numbers - MUCH SIMPLER
  const generatePageNumbers = () => {
    const pages = [];
    const delta = 2; // Show 2 pages before and after current page
    
    const start = Math.max(1, currentPage - delta);
    const end = Math.min(totalPages, currentPage + delta);
    
    // Add first page and ellipsis if needed
    if (start > 1) {
      pages.push(1);
      if (start > 2) {
        pages.push('...');
      }
    }
    
    // Add pages around current page
    for (let i = start; i <= end; i++) {
      pages.push(i);
    }
    
    // Add ellipsis and last page if needed
    if (end < totalPages) {
      if (end < totalPages - 1) {
        pages.push('...');
      }
      pages.push(totalPages);
    }
    
    return pages;
  };

  return (
    <div className="flex flex-col h-full">
      <div className="flex-1 space-y-3 overflow-y-auto">
        <AnimatePresence mode="wait">
          {currentTemplates.length > 0 ? (
            currentTemplates.map((template) => (
              <motion.div
                key={template._id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.25, ease: "easeInOut" }}
              >
                <Template
                  id={template._id}
                  title={template.title}
                  description={template.description}
                  category={template.category}
                  creatorId={template.creatorId}
                  onClose={toggleOpen}
                />
              </motion.div>
            ))
          ) : (
            <motion.div
              key="no-templates"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.25 }}
              className="flex justify-center items-center h-full"
            >
              <p className="text-gray-500">
                No templates found. Try searching for another keyword.
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Pagination Controls */}
      {displayTemplates.length > templatesPerPage && (
        <div className="flex justify-center items-center gap-2 py-4 border-t border-base-300">
          <button 
            className={`btn btn-sm btn-circle ${currentPage === 1 ? 'btn-disabled' : ''}`}
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
                    currentPage === page ? 'btn-active btn-primary' : ''
                  }`}
                  onClick={() => setCurrentPage(page)}
                >
                  {page}
                </button>
              );
            })}
          </div>
          
          <button 
            className={`btn btn-sm btn-circle ${currentPage === totalPages ? 'btn-disabled' : ''}`}
            onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
            disabled={currentPage === totalPages}
          >
            ›
          </button>
        </div>
      )}
    </div>
  );
};

export default TemplatesContainer;