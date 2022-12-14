const express = require("express")
const router = express.Router()
const { getGoals, setGoal, updateGoal, deleteGoal } = require("../controllers/goalController")

const {protect} = require("../middleware/authMiddleware")

router.route("/").get(protect, getGoals).post(protect, setGoal) //when you add protect, you need a token
router.route("/:id").delete(protect, deleteGoal).put(protect, updateGoal)

// router.get("/", getGoals)            //The two lines above are a better, more concise, version of this

// router.post("/", setGoal)

// router.put("/:id", updateGoal)

// router.delete("/:id", deleteGoal)


module.exports = router