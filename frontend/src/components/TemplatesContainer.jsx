import React, { useEffect } from "react";
import Template from "./Template";
import { useTemplateStore } from "../stores/useTemplateStore";
import { motion, AnimatePresence } from "framer-motion";

const TemplatesContainer = ({ toggleOpen }) => {
  const {
    templates,
    filteredTemplates,
    searchTerm,
    searchedTemplates,
    setSelectedCategory,
  } = useTemplateStore();

  let displayTemplates = templates;

  if (searchTerm.length > 0) {
    displayTemplates = searchedTemplates;
  }

  if (filteredTemplates.length > 0 && searchTerm.length === 0) {
    displayTemplates = filteredTemplates;
  }

  useEffect(() => {
    if (searchTerm.length > 0) {
      setSelectedCategory("");
    }
  }, [searchTerm, setSelectedCategory]);

  return (
    <div className="space-y-4">
      <AnimatePresence mode="wait">
        {displayTemplates.map((template) => (
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
      </AnimatePresence>
    </div>
  );
};

export default TemplatesContainer;
