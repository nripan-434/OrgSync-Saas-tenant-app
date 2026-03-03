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