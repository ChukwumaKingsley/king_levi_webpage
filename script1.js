const populationUrl = "https://pxdata.stat.fi/PxWeb/api/v1/fi/StatFin/vaerak/statfin_vaerak_pxt_11ra.px";
const employmentUrl = "https://pxdata.stat.fi/PxWeb/api/v1/fi/StatFin/tyokay/statfin_tyokay_pxt_115b.px";

// Fetch StatFin data with POST request
const fetchStatFinData = async (url, body) => {
  const response = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body)
  });
  return await response.json();
};

// Build and populate the table
const setupTable = (populationData, employmentData) => {
  const tableBody = document.getElementById("table-rows");

  const municipalities = populationData.dimension.Alue.category.label;
  const municipalityCodes = populationData.dimension.Alue.category.index;
  const populationValues = populationData.value;
  const employmentValues = employmentData.value;

  Object.entries(municipalities).forEach(([code, name], index) => {
    const population = populationValues[index];
    const employment = employmentValues[index];
    const employmentPercent = ((employment / population) * 100).toFixed(2);

    const row = document.createElement("tr");

    // Conditional background color
    if (employmentPercent > 45) {
      row.style.backgroundColor = "#abffbd";
    } else if (employmentPercent < 25) {
      row.style.backgroundColor = "#ff9e9e";
    } else {
      row.style.backgroundColor = index % 2 === 1 ? "#f2f2f2" : "#ffffff";
    }

    row.innerHTML = `
      <td>${name}</td>
      <td>${population.toLocaleString()}</td>
      <td>${employment.toLocaleString()}</td>
      <td>${employmentPercent} %</td>
    `;
    tableBody.appendChild(row);
  });
};

// Load queries and fetch data
const initializeCode = async () => {
  const populationBody = await (await fetch("Scripts\\population_query.json")).json();
  const employmentBody = await (await fetch("Scripts\\employment_query.json")).json();

  const [populationData, employmentData] = await Promise.all([
    fetchStatFinData(populationUrl, populationBody),
    fetchStatFinData(employmentUrl, employmentBody)
  ]);

  setupTable(populationData, employmentData);
};

initializeCode();
