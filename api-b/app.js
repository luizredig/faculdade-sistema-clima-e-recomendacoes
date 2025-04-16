require("dotenv").config({ path: "./.env" });

const express = require("express");
const app = express();
const fs = require("fs");
const path = require("path");

const PORT = 3001;

const filePath = path.join(__dirname, "cities.json");

const data = fs.readFileSync(filePath, "utf-8");

const cities = JSON.parse(data);

async function fetchData(citySlug) {
  try {
    const cityData = cities.find(
      (c) => c.slug.toLowerCase() === citySlug.toLowerCase()
    );

    if (!cityData) {
      throw new Error("Cidade não encontrada no mock.");
    }

    return {
      city: cityData.name,
      temp: cityData.temp,
      unit: "Celsius",
    };
  } catch (error) {
    console.error("Erro ao buscar dados do mock:", error.message);
    throw new Error("Não foi possível obter os dados climáticos.");
  }
}

app.get("/weather/:city", async (req, res) => {
  const city = req.params.city;

  try {
    const weather = await fetchData(city);
    res.json(weather);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

async function init() {
  app.listen(PORT, () => {
    console.log(`API B rodando na porta ${PORT}`);
  });
}

init();
