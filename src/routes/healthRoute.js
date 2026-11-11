import express from "express";

const router = express.Router();

router.get("/", (req, res) => {
    res.status(200).json({
        status: "OK",
        service: "Workout API",
    });
});

export default router;
