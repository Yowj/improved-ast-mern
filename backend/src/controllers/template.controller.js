import Template from "../models/template.model.js";

export const createTemplate = async (req, res) => {
  try {
    const creatorId = req.user._id;

    const { title, description, category } = req.body;

    if (!title || !description || !category) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const newTemplate = new Template({
      creatorId,
      title,
      description,
      category,
    });

    await newTemplate.save();
    return res
      .status(201)
      .json({ message: "Template created successfully", template: newTemplate });
  } catch (error) {
    console.error("Error creating template:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

export const getTemplates = async (req, res) => {
  try {
    const templates = await Template.find();
    return res.status(200).json({ templates });
  } catch (error) {
    console.error("Error fetching templates:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

export const updateTemplate = async (req, res) => {
  try {
    const templateId = req.params.id;
    const { title, description, category } = req.body;

    if (!title || !description || !category) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const template = await Template.findByIdAndUpdate(
      templateId,
      { title, description, category },
      { new: true }
    );
    await template.save();
    return res.status(200).json({ message: "Template updated successfully", template, new: true });
  } catch (error) {
    console.error("Error updating template:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

export const deleteTemplate = async (req, res) => {
  try {
    const templateId = req.params.id;

    const template = await Template.findByIdAndDelete(templateId);
    if (!template) {
      return res.status(404).json({ message: "Template not found" });
    }

    return res.status(200).json({ message: "Template deleted successfully" });
  } catch (error) {
    console.error("Error deleting template:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

export const getTemplateById = async (req, res) => {
  try {
    const templateId = req.params.id;

    const template = await Template.findById(templateId);
    if (!template) {
      return res.status(404).json({ message: "Template not found" });
    }

    return res.status(200).json({ template });
  } catch (error) {
    console.error("Error fetching template:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

export const grammarEnhance = async (req, res) => {
  const input = req.body.input;
  try {
    if (!input) {
      return res.status(401).json({ message: "No input" });
    }

    const jsonString = {
      model: "google/gemma-3-4b-it:free", //deepseek/deepseek-chat-v3-0324:free
      messages: [
        {
          role: "user",
          content: `Please fix the grammar of the following, the output should only be the corrected version, nothing else, also don't put any apostrophes. You are also allowed to change the structure to make it clearer, conscise and better:"${input}"`,
        },
      ],
    };

const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
  method: "POST",
  headers: {
    "Content-Type": "application/json",
    "Authorization": `Bearer ${process.env.OPENROUTER_API}`,
  },
  body: JSON.stringify(jsonString),
});

const data = await response.json();

if (!data.choices || !data.choices[0]?.message?.content) {
  console.error("OpenRouter returned unexpected data:", data);
  return res.status(500).json({ message: "Invalid AI response from OpenRouter" });
}

const output = data.choices[0].message.content;
return res.status(200).json({ aiResponse: output });

  } catch (error) {
    console.error("Error fetching AI response:", error);
    return res.status(500).json({ message: "Internal server error from OpenRouter" });
  }
};
