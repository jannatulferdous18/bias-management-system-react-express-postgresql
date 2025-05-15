const express = require("express");
const router = express.Router();
const { supabase } = require("../supabaseClient");

router.get("/:id", async (req, res) => {
  const { id } = req.params;

  const { data, error } = await supabase
    .from("biases")
    .select("*")
    .eq("bias_id", id)
    .single();

  if (error) {
    console.error(error);
    return res.status(500).json({ error: error.message });
  }

  res.json(data);
});

module.exports = router;
