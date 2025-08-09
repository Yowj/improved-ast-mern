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
      model: "qwen/qwen-2.5-72b-instruct:free", //deepseek/deepseek-chat-v3-0324:free
      messages: [
        {
          role: "user",
          content: `Support Message Improver
Instructions:
Fix and improve the following support message. Make it sound natural and friendly while being clear and helpful.
What to improve:

Fix grammar and spelling mistakes
Replace Tagalog words with English
Improve sentence flow and structure
Make it easier to understand
Keep it conversational but professional
Remove contractions (use "cannot" instead of "can't")

What NOT to do:

Do not make it too formal or robotic
Do not add extra information or footnotes
Do not change the main message or add new content
Do not use overly fancy words

Output:
Just give me the improved version, nothing else.
Text to improve:
"${input}"`,
        },
      ],
    };

    const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.OPENROUTER_API}`,
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

function buildTemplatePrompt(templates, question) {
  let prompt = `### Role
- Primary Function: You are a helpful Webnovel customer support AI assistant. You help authors and readers with their inquiries about contracts, payments, publishing, and platform features. You aim to provide accurate, friendly, and efficient replies at all times.

### Response Guidelines
- Use plain text only - NO markdown formatting (**bold**, *italic*, etc.)
- Keep responses conversational and natural
- Always end with a positive note or offer to help further
- Use bullet points with "•" if listing multiple items

### Constraints
1. Only answer questions related to Webnovel platform, publishing, contracts, payments, and writing
2. If asked about unrelated topics, politely redirect: "I'm here to help with Webnovel-related questions. Is there anything about publishing, contracts, or payments I can assist you with?"
3. Base answers exclusively on the provided training data
4. If training data doesn't cover the question, refer to official resources
5. Do not add any signatures or footnotes, only add Yowj and Xero signature template when prompted.


### Training Data:\n`;

  templates.forEach((template) => {
    prompt += `* ${template.title}: ${template.description}\n`;
  });

  prompt += `\n### Response Format
- If the question is covered by training data: Provide a helpful answer based on the information above
- If partially covered: Answer what you can and direct to official resources
- If not covered: "I don't have specific information about that in my knowledge base. For detailed assistance, please visit https://help.webnovel.com or contact support@webnovel.com for personalized help."
- Always offer additional assistance at the end`;

  return prompt;
}

export const askAi = async (req, res) => {
  try {
    const { question } = req.body;

    // Validate input
    if (!question) {
      return res.status(400).json({ message: "Question is required" });
    }

    const templates = await Template.find();
    const templatePrompt = buildTemplatePrompt(templates, question);

    // FIXED: Correct OpenRouter API format
    const response = await fetch(`https://openrouter.ai/api/v1/chat/completions`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.OPENROUTER_API_KEY}`, // Changed from GOOGLE_AI_API_KEY
      },
      body: JSON.stringify({
        // FIXED: Removed 'contents' wrapper
        model: "qwen/qwen-2.5-72b-instruct:free", // Fixed model name
        messages: [
          {
            role: "system",
            content: templatePrompt,
          },
          {
            role: "user",
            content: question,
          },
        ],
        max_tokens: 2000,
        temperature: 0.3,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("API Error:", errorText);
      throw new Error(`API request failed: ${response.status} - ${errorText}`);
    }

    const data = await response.json();
    console.log("API Response:", data); // For debugging

    if (!data.choices || !data.choices[0]?.message?.content) {
      throw new Error("Invalid AI response format");
    }

    const aiResponse = data.choices[0].message.content;
    return res.status(200).json({ aiResponse });
  } catch (error) {
    console.error("Error in askAi:", error);

    return res.status(500).json({
      message: "Failed to generate AI response",
      error: error.message,
    });
  }
};
