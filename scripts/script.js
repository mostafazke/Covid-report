const apiURL = "https://api.covid19api.com/summary";
const nFormmater = d3.format(".2s");
// Total Values
const container = d3.select(".container");
const topInfo = container.select(".top-info");
const totalConfirmed = topInfo.select(".total-cases");
const totalRecovered = topInfo.select(".total-recovered");
const totalDeaths = topInfo.select(".total-deaths");
let data;


d3.json(apiURL)
  .then((rawData) => {
    data = rawData;
    const global = data.Global;
    totalConfirmed.select(".value").text(nFormmater(global.TotalConfirmed)).attr('title', global.TotalConfirmed);
    totalRecovered.select(".value").text(nFormmater(global.TotalRecovered)).attr('title', global.TotalRecovered);
    totalDeaths.select(".value").text(nFormmater(global.TotalDeaths)).attr('title', global.TotalDeaths);
    map(data)
  })
  .catch((error) => console.error(error.error));
