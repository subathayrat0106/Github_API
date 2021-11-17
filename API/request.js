const axios = require("axios");

const baseUrl = "https://api.github.com";

exports.HttpRquest = async (endPoint) => {
  try {
    return await axios({
      url: baseUrl + endPoint,
      method: "get",
      headers: {
        accept: "application/vnd.github.v3+json",
      },
    });
  } catch (err) {
    throw new Error("Request Failed" + err.message);
  }
};
