import { Router } from "express";
import { analyzeString, deleteAnalyzedString, 
    filterByNaturalLanguage, getAllAnalyzedStrings,
    getAnalyzedString 
} from "../controllers";

const router = Router();

router.post("/strings", analyzeString);
router.get("/strings/filter-by-natural-language", filterByNaturalLanguage);
router.get("/strings/:string_value", getAnalyzedString);
router.get("/strings", getAllAnalyzedStrings);
router.delete("/strings/:string_value", deleteAnalyzedString);

export default router;