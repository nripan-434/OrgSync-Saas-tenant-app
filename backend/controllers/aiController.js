import { asyncHandler } from "../middleware/asyncHandler.js"
import { aiTaskGenerateService } from "../services/aiOrchestrator.js"

export const aiTaskGenerate = asyncHandler(async (req, res) => {

  const { projectId, prompt } = req.body

  if (!projectId || !prompt) {
    return res.status(400).json({ message: "Project Id and Prompt required" })
  }

  const result = await aiTaskGenerateService({
    projectId,
    prompt
  })

  return res.status(200).json(result)

})


// import axios from "axios"
// import projectModel from "../models/projectModel.js"
// import OrganizationModel from "../models/OrganizationModel.js"
// import { asyncHandler } from "../middleware/asyncHandler.js"

// export const aiTaskGenerate= asyncHandler(async ({
//   projectId,
//   prompt
// }) => {

//   if (!projectId || !prompt) {
//     throw new Error("Project Id and Prompt required")
//   }

//   const project = await projectModel
//     .findById(projectId)
//     .populate("organizationId")

//   if (!project) {
//     throw new Error("Project not found")
//   }

//   const organization = project.organizationId

//   if (!organization) {
//     throw new Error("Organization not found")
//   }

//   if (organization.aiCreditsLimit < 10) {
//     throw new Error("Insufficient AI Credits")
//   }

//   const fullPrompt = `
// Project Context:
// ${project.description}

// Admin Instruction:
// ${prompt}

// Generate structured tasks in JSON array format.

// Each task must contain:
// - title
// - description
// - priority (low | medium | high)

// Return ONLY valid JSON array.
// Do not include explanation.
// `

//   const response = await axios.post(
//     `https://generativelanguage.googleapis.com/v1/models/gemini-1.5-pro:generateContent?key=${process.env.GEMINI_API_KEY}`,
//     {
//       contents: [
//         {
//           parts: [{ text: fullPrompt }]
//         }
//       ]
//     }
//   )

//   const aiResponse =
//     response.data.candidates[0].content.parts[0].text

//   const tasks = JSON.parse(aiResponse)

//   organization.aiCreditsLimit -= 10
//   await organization.save()

//   return {
//     tasks,
//     remainingCredits: organization.aiCreditsLimit
//   }
// })
