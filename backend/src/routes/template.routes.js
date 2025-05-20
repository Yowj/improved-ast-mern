import express from "express";
import {
  createTemplate,
  deleteTemplate,
  getTemplateById,
  getTemplates,
  updateTemplate,
  grammarEnhance
} from "../controllers/template.controller.js";

import { protect } from "../middlewares/auth.middleware.js";

const router = express.Router();

router.get("/getTemplates", protect, getTemplates);
router.post("/createTemplate", protect, createTemplate);
router.put("/updateTemplate/:id", protect, updateTemplate);
router.delete("/deleteTemplate/:id", protect, deleteTemplate);
router.get("/getTemplateById/:id", protect, getTemplateById);
router.post("/grammarEnhance", grammarEnhance)

export default router;
