const express = require("express");
const axios = require("axios");
const cors = require("cors");

const app = express();
const PORT = 4000;

// Habilitar CORS
app.use(cors());

// 1. Endpoint para obtener países disponibles
app.get("/available-countries", async (req, res) => {
  try {
    const response = await axios.get(
      "https://date.nager.at/api/v3/AvailableCountries"
    );
    const countries = response.data;
    res.json(countries);
  } catch (error) {
    console.error("Error retrieving available countries:", error);
    res.status(500).json({ error: "Error retrieving available countries" });
  }
});

// 2. Endpoint para obtener información de un país específico
app.get("/country-info/:countryCode", async (req, res) => {
  const countryCode = req.params.countryCode;
  console.log("Fetching info for country code:", countryCode);

  try {
    const countryInfoResponse = await axios.get(
      `https://date.nager.at/api/v3/CountryInfo/${countryCode}`
    );

    const countryInfo = countryInfoResponse.data;

    if (!countryInfo || !countryInfo.borders) {
      console.log("No country information or borders found.");
      return res.status(404).json({ error: "Country data not found" });
    }

    // Realizar solo una solicitud para población
    const populationResponse = await axios.post(
      "https://countriesnow.space/api/v0.1/countries/population",
      { country: countryInfo.commonName } // Cambiado a commonName
    );
    console.log("populationResponse:", populationResponse.data);

    const populationCounts =
      populationResponse.data.data.populationCounts || [];
    console.log("populationCounts:", populationCounts);

    // Obtener la bandera
    const flagResponse = await axios.get(
      "https://countriesnow.space/api/v0.1/countries/flag/images",
      { country: countryInfo.countryCode }
    );

    console.log("flagResponse:", JSON.stringify(flagResponse.data, null, 2)); // Imprime la respuesta en formato legible

    const flagData = flagResponse.data.data.find(
      (item) => item.iso2 === countryCode // Asegúrate de que esto sea correcto
    );

    if (!flagData) {
      console.log("Flag data not found for country code:", countryCode);
      return res.status(404).json({ error: "Flag data not found" });
    }

    const flagUrl = flagData ? flagData.flag : null;
    console.log("flag URL:", flagUrl);

    const countryData = {
      commonName: countryInfo.commonName,
      countryCode: countryInfo.countryCode,
      borders: countryInfo.borders.map((border) => ({
        commonName: border.commonName,
        countryCode: border.countryCode,
      })),
      populationCounts: populationCounts.map((item) => ({
        year: item.year,
        value: item.value,
      })),
      flagUrl: flagUrl,
    };

    console.log(countryData);
    res.json(countryData);
  } catch (error) {
    console.error(
      "Error fetching country info:",
      error.response ? error.response.data : error.message
    );
    res.status(500).json({
      error: "Error retrieving country information",
      details: error.response ? error.response.data : error.message,
    });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
