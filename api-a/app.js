require("dotenv").config({ path: "./.env" });

const express = require("express");
const axios = require("axios");
const app = express();

const PORT = process.env.PORT;
const API_B_URL = process.env.API_B_URL;

async function fetchData(citySlug) {
  try {
    const response = await axios.get(`${API_B_URL}/${citySlug}`);
    const { city, temp, unit } = response.data;

    let recommendation;

    if (temp > 30) {
      recommendation =
        "Está muito quente! Mantenha-se hidratado e use protetor solar.";
    } else if (temp > 15) {
      recommendation = "Clima agradável. Aproveite seu dia!";
    } else {
      recommendation = "Está frio! Vista um casaco.";
    }

    return {
      city,
      temp,
      unit,
      recommendation,
    };
  } catch (error) {
    console.error("Erro ao consultar API B:", error.message);
    throw new Error("Não foi possível obter a recomendação.");
  }
}

app.get("/recommendation/:city", async (req, res) => {
  const citySlug = req.params.city;

  try {
    const result = await fetchData(citySlug);
    res.json(result);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

async function init() {
  app.listen(PORT, () => {
    console.log(`API A rodando na porta ${PORT}`);
  });
}

init();
