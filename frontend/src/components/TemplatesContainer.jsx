import React, { useEffect } from "react";
import Template from "./Template";
import { useTemplateStore } from "../stores/useTemplateStore";

const TemplatesContainer = ({ toggleOpen }) => {
  const { templates, fetchTemplates, filteredTemplates, searchTerm, searchedTemplates } =
    useTemplateStore();

  let displayTemplates = templates;

  if (searchTerm.length > 0) {
    displayTemplates = filteredTemplates.length > 0 ? filteredTemplates : searchedTemplates;
  }

  useEffect(() => {
    fetchTemplates();
  }, [fetchTemplates]);

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
            No templates found. Try searching for other keyword bobo ka ba
          </p>
        </div>
      )}
    </div>
  );
};

export default TemplatesContainer;
