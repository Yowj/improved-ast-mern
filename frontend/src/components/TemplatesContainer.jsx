import React, { useEffect, useState } from "react";
import Template from "./Template";
import { useTemplateStore } from "../stores/useTemplateStore";
import { motion, AnimatePresence } from "framer-motion";

const TemplatesContainer = ({ toggleOpen, currentPage, setCurrentPage, templatesPerPage = 11 }) => {
  const { templates, filteredTemplates, searchTerm, searchedTemplates, setSelectedCategory, getUserById } =
    useTemplateStore();

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
    if (setCurrentPage) {
      setCurrentPage(1);
    }
  }, [searchTerm, filteredTemplates, setCurrentPage]);

  useEffect(() => {
    if (searchTerm.length > 0) {
      setSelectedCategory("");
    }
  }, [searchTerm, setSelectedCategory]);

  // Prefetch usernames for all unique creators when templates change
  useEffect(() => {
    const uniqueCreatorIds = [...new Set(displayTemplates.map(template => template.creatorId))];
    uniqueCreatorIds.forEach(creatorId => {
      if (creatorId) {
        getUserById(creatorId); // This will cache the username
      }
    });
  }, [displayTemplates, getUserById]);

  // Smart responsive pagination generator
  const generatePageNumbers = () => {
    const pages = [];
    const isMobile = typeof window !== 'undefined' && window.innerWidth < 640; // sm breakpoint
    const delta = isMobile ? 1 : 2; // Show fewer pages on mobile
    const maxMobilePages = 3; // Maximum page buttons on mobile
    
    // Mobile-first approach
    if (isMobile && totalPages > maxMobilePages + 2) {
      // Always show first page
      if (currentPage > 2) {
        pages.push(1);
        if (currentPage > 3) {
          pages.push('...');
        }
      }
      
      // Show current page and immediate neighbors
      const start = Math.max(1, currentPage - 1);
      const end = Math.min(totalPages, currentPage + 1);
      
      for (let i = start; i <= end; i++) {
        if (!pages.includes(i)) {
          pages.push(i);
        }
      }
      
      // Always show last page
      if (currentPage < totalPages - 1) {
        if (currentPage < totalPages - 2) {
          pages.push('...');
        }
        if (!pages.includes(totalPages)) {
          pages.push(totalPages);
        }
      }
      
      return pages;
    }
    
    // Desktop logic (original)
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
    <div className="space-y-3">
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
            className="flex justify-center items-center py-12"
          >
            <p className="text-gray-500">
              No templates found. Try searching for another keyword.
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

// Export pagination utilities for use in parent component
export const usePaginationData = (templates, filteredTemplates, searchTerm, searchedTemplates, templatesPerPage) => {
  let displayTemplates = templates;

  if (searchTerm.length > 0) {
    displayTemplates = searchedTemplates;
  }

  if (filteredTemplates.length > 0 && searchTerm.length === 0) {
    displayTemplates = filteredTemplates;
  }

  return {
    displayTemplates,
    totalPages: Math.ceil(displayTemplates.length / templatesPerPage),
    hasMultiplePages: displayTemplates.length > templatesPerPage
  };
};

export default TemplatesContainer;