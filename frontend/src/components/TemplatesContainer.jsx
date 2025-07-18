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

  return (
    <div className="flex flex-col h-full">
      <div className="flex-1 space-y-4 overflow-y-auto">
        <AnimatePresence mode="wait">
          <>
            {currentTemplates.map((template) => (
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
            ))}

            {displayTemplates.length === 0 && (
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
          </>
        </AnimatePresence>
      </div>

      {/* Pagination Controls */}
      {displayTemplates.length > templatesPerPage && (
        <div className="flex justify-center items-center gap-2 py-4 border-t border-base-300">
          <button 
            className="btn btn-sm btn-circle"
            onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
            disabled={currentPage === 1}
          >
            ‹
          </button>
          
          <div className="join">
            {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => {
              // Show only 5 page numbers at a time
              if (
                page === 1 ||
                page === totalPages ||
                (page >= currentPage - 2 && page <= currentPage + 2)
              ) {
                return (
                  <button
                    key={page}
                    className={`join-item btn btn-sm ${
                      currentPage === page ? 'btn-active' : ''
                    }`}
                    onClick={() => setCurrentPage(page)}
                  >
                    {page}
                  </button>
                );
              } else if (
                page === currentPage - 3 ||
                page === currentPage + 3
              ) {
                return <span key={page} className="join-item btn btn-sm btn-disabled">...</span>;
              }
              return null;
            })}
          </div>
          
          <button 
            className="btn btn-sm btn-circle"
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