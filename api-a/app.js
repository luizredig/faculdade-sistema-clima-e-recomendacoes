require("dotenv").config({ path: "./.env" });

const express = require("express");
const axios = require("axios");
const app = express();
const redis = require("redis");

let redis_client;
let redis_data;

const PORT = process.env.PORT;
const API_B_URL = process.env.API_B_URL;

async function fetchData(citySlug) {
  try {
    let data;

    if (!redis_data) {
      const response = await axios.get(`${API_B_URL}/${citySlug}`);

       client.set(cacheKey, JSON.stringify(response.data), {
         EX: 60,
       });
      
      data = response.data;
      redis_data = response.data;

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
    }

    const { city, temp, unit } = data;

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
  if (!redis_client) {
    redis_client = redis.createClient({
      host: "redis",
      port: 6379,
    });

    redis_client.on("error", (err) => {
      console.error("Redis error:", err);
    });
    await redis_client.connect();
  }

  const cacheKey = req.params.city;
  let data = await redis_client.get(cacheKey);

  redis_data = data !== null ? JSON.parse(data) : null;

  try {
    const result = await fetchData(cacheKey);
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
