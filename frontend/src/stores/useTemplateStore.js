import { create } from "zustand";
import { axiosInstance } from "../lib/axios.js";
import toast from "react-hot-toast";
import Fuse from "fuse.js";

export const useTemplateStore = create((set, get) => ({
  templates: [],
  categories: [],
  filteredTemplates: [],
  searchedTemplates: [],
  isLoading: false,
  isCreating: false,
  isUpdating: false,
  isDeleting: false,
  username: "",
  selectedCategory: "",
  searchTerm: "",

  setSelectedCategory: (category) => {
    set({ selectedCategory: category });
    const templates = get().templates;
    const filteredTemplates = templates.filter((template) => template.category === category);
    set({ filteredTemplates });
  },

  setSearchTerm: (searchTerm) => {
    set({ searchTerm });
    const templates = get().templates;
  
    const keywords = searchTerm.toLowerCase().split(" ").filter(Boolean); // remove extra spaces
  
    const searchedTemplates = templates.filter((template) => {
      const title = template.title.toLowerCase();
      const description = template.description.toLowerCase();
  
      // Return true if ALL keywords exist somewhere in title or description
      return keywords.every((word) =>
        title.includes(word) || description.includes(word)
      );
    });
  
    set({ searchedTemplates });
  },

  fetchTemplates: async () => {
    set({ isLoading: true });
    try {
      const res = await axiosInstance.get("/template/getTemplates");
      const templates = res.data.templates;

      const categories = [...new Set(templates.map((template) => template.category))];

      set({ templates, categories });
    } catch (error) {
      console.error("Error fetching templates:", error);
    } finally {
      set({ isLoading: false });
    }
  },

  createTemplate: async (data) => {
    set({ isCreating: true });
    try {
      await axiosInstance.post("/template/createTemplate", data);
      await get().fetchTemplates(); // this will set the new list
      toast.success("Template created successfully");
    } catch (error) {
      toast.error(error.response?.data?.message || "Error creating template");
      console.error("Error creating template:", error);
    } finally {
      set({ isCreating: false });
    }
  },

  updateTemplate: async (id, data) => {
    set({ isUpdating: true });
    try {
      await axiosInstance.put(`/template/updateTemplate/${id}`, data);
      await get().fetchTemplates(); // this will set the new list
      toast.success("Template updated successfully");
    } catch (error) {
      toast.error(error.response?.data?.message || "Error updating template");
      console.error("Error updating template:", error);
    } finally {
      set({ isUpdating: false });
    }
  },

  deleteTemplate: async (id) => {
    set({ isDeleting: true });
    try {
      await axiosInstance.delete(`/template/deleteTemplate/${id}`);
      await get().fetchTemplates(); // this will set the new list
      toast.success("Template deleted successfully");
    } catch (error) {
      toast.error(error.response?.data?.message || "Error deleting template");
      console.error("Error deleting template:", error);
    } finally {
      set({ isDeleting: false });
    }
  },

  getUserById: async (id) => {
    set({ isLoading: true });
    try {
      const res = await axiosInstance.get(`/user/${id}`);
      set({ username: res?.data.user.fullName || "Unknown" });
    } catch (error) {
      toast.error(error.response?.data?.message || "Error getting userById");
      console.error("Error getting userById:", error);
    } finally {
      set({ isLoading: false });
    }
  },
}));
