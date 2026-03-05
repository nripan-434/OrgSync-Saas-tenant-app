// // controllers/aiController.js
// import { asyncHandler } from "../middleware/asyncHandler.js";
// import projectModel from "../models/projectModel.js";
// import OrganizationModel from "../models/OrganizationModel.js";
// import axios from "axios";

// export const aiTaskGenerate = asyncHandler(async (req, res) => {
//   const { projectId, prompt } = req.body;

//   // Validation
//   if (!projectId || !prompt) {
//     return res.status(400).json({
//       success: false,
//       message: "Project Id and Prompt are required",
//     });
//   }

//   // Find project
//   const project = await projectModel.findById(projectId).populate("organizationId");
//   if (!project) {
//     return res.status(404).json({ success: false, message: "Project not found" });
//   }

//   const organization = project.organizationId;
//   if (!organization) {
//     return res.status(404).json({ success: false, message: "Organization not found" });
//   }

//   // Credit check
//   if (organization.aiCreditsLimit < 10) {
//     return res.status(403).json({ success: false, message: "Insufficient AI credits" });
//   }

//   // Build full prompt
//   const fullPrompt = `
// Project Context:
// ${project.description || "No description"}

// Instruction:
// ${prompt}

// Generate project tasks in JSON array format.

// Each task should contain:
// - title
// - description
// - priority (low | medium | high)

// Return ONLY valid JSON array.
// `;

//   try {
//     // ✅ Call Hugging Face Inference API
//     const response = await axios.post(
//       "https://api-inference.huggingface.co/models/mistralai/Mistral-7B-Instruct",
//       { inputs: fullPrompt },
//       {
//         headers: {
//           Authorization: `Bearer ${process.env.HF_TOKEN}`,
//         },
//       }
//     );

//     // Hugging Face returns an array of outputs
//     const aiResponse = response.data[0]?.generated_text?.trim();

//     let tasks;
//     try {
//       tasks = JSON.parse(aiResponse);
//     } catch {
//       return res.status(500).json({
//         success: false,
//         message: "AI response format invalid",
//         rawResponse: aiResponse,
//       });
//     }

//     // Deduct credits
//     organization.aiCreditsLimit -= 10;
//     await organization.save();

//     res.status(200).json({
//       success: true,
//       tasks,
//       taskCount: tasks.length,
//       remainingCredits: organization.aiCreditsLimit,
//     });
//   } catch (error) {
//     console.error("Hugging Face API Error:", error.response?.data || error.message);
//     res.status(500).json({
//       success: false,
//       message: "Error generating tasks",
//       error: error.response?.data?.error || error.message,
//     });
//   }
// });
