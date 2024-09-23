const express = require("express");
const axios = require("axios");
const cors = require("cors");
require("dotenv").config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());

app.get("/available-countries", async (req, res) => {
  try {
    const response = await axios.get(
      "https://date.nager.at/api/v3/AvailableCountries"
    );
    res.json(response.data);
  } catch (error) {
    res.status(500).json({ error: "Error retrieving available countries" });
  }
});

app.get("/country-info/:countryCode", async (req, res) => {
  const countryCode = req.params.countryCode;

  try {
    const countryInfoResponse = await axios.get(
      `https://date.nager.at/api/v3/CountryInfo/${countryCode}`
    );
    const countryInfo = countryInfoResponse.data;

    if (!countryInfo || !countryInfo.borders) {
      return res.status(404).json({ error: "Country data not found" });
    }

    const populationResponse = await axios.post(
      "https://countriesnow.space/api/v0.1/countries/population",
      {
        country: countryInfo.commonName,
      }
    );

    const populationCounts =
      populationResponse.data.data.populationCounts || [];

    const flagResponse = await axios.get(
      "https://countriesnow.space/api/v0.1/countries/flag/images",
      {
        country: countryInfo.countryCode,
      }
    );

    const flagData = flagResponse.data.data.find(
      (item) => item.iso2 === countryCode
    );

    if (!flagData) {
      return res.status(404).json({ error: "Flag data not found" });
    }

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
      flagUrl: flagData.flag,
    };

    res.json(countryData);
  } catch (error) {
    res.status(500).json({
      error: "Error retrieving country information",
      details: error.response ? error.response.data : error.message,
    });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
