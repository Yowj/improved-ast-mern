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
