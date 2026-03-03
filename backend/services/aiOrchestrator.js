import projectModel from "../models/projectModel.js"
import OrganizationModel from "../models/OrganizationModel.js"
import OpenAI from "openai"
import { asyncHandler } from "../middleware/asyncHandler.js"

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
})

export const aiTaskGenerateService = asyncHandler(async ({
    projectId,
    prompt
  }) => {


  if (!projectId || !prompt) {
    return res.status(400).json({ message: "Project Id and Prompt required" })
  }

  const project = await projectModel.findById(projectId).populate("organizationId")

  if (!project) {
    return res.status(404).json({ message: "Project not found" })
  }

  const organization = project.organizationId

  if (!organization) {
    return res.status(404).json({ message: "Organization not found" })
  }

  if (organization.aiCreditsLimit < 10) {
    return res.status(400).json({ message: "Insufficient AI Credits" })
  }

  const fullPrompt = `
Project Context:
${project.description}

Admin Instruction:
${prompt}

Generate structured tasks in JSON array format.

Each task must contain:
- title
- description
- priority (low | medium | high)

Return only JSON array.
`

  const completion = await openai.chat.completions.create({
    model: "gpt-4o-mini",
    messages: [
      { role: "user", content: fullPrompt }
    ],
    temperature: 0.7
  })

  let aiResponse = completion.choices[0].message.content

  let tasks

  try {
    tasks = JSON.parse(aiResponse)
  } catch (error) {
    return res.status(500).json({ message: "AI returned invalid format" })
  }

  if (!Array.isArray(tasks)) {
    return res.status(500).json({ message: "AI response must be an array" })
  }

  organization.aiCreditsLimit -= 10
  await organization.save()

  return res.status(200).json({
    tasks,
    taskCount: tasks.length,
    remainingCredits: organization.aiCreditsLimit
  })

})