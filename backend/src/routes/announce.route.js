import express from "express"
import { getAnnounces,saveAnnounce,deleteAnnounce} from "../controllers/announcement.js"
const router = express.Router()
router.get("/",getAnnounces)
router.post("/send",saveAnnounce);
router.delete("/delete",deleteAnnounce);
export default router;