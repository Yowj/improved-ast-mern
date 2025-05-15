import React, { useEffect } from "react";
import Template from "./Template";
import { useTemplateStore } from "../stores/useTemplateStore";

const TemplatesContainer = ({ toggleOpen }) => {
  const { templates, filteredTemplates, searchTerm, searchedTemplates, setSelectedCategory } =
    useTemplateStore();

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
    <div>
      {displayTemplates.map((template) => (
        <Template
          key={template._id}
          id={template._id}
          title={template.title}
          description={template.description}
          category={template.category}
          creatorId={template.creatorId}
          onClose={toggleOpen}
        />
      ))}

      {displayTemplates.length === 0 && (
        <div className="flex justify-center items-center h-full">
          <p className="text-gray-500">
            No templates found. Try searching for other keyword
          </p>
        </div>
      )}
    </div>
  );
};

export default TemplatesContainer;
