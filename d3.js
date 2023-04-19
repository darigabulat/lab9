let points = [];
for (let i = 0; i < 100; i++) {
  points.push({ x: Math.random() * 500, y: Math.random() * 500 });
}

const scatterplot = d3
  .select("#scatterplot")
  .append("svg")
  .attr("width", 500)
  .attr("height", 500);

scatterplot
  .selectAll("circle")
  .data(points)
  .enter()
  .append("circle")
  .attr("cx", (d) => d.x)
  .attr("cy", (d) => d.y)
  .attr("r", 3)
  .attr("fill", "blue");

d3.csv("titanic.csv").then((data) => {
  let ageDist = {};
  data.forEach((row) => {
    if (row.Age) {
      let ageRange = Math.floor(row.Age / 10) * 10;
      ageDist[ageRange] = (ageDist[ageRange] || 0) + 1;
    }
  });

  let pieChartData = Object.entries(ageDist).map(([key, value]) => {
    return { label: `${key}-${+key + 9}`, count: value };
  });

  const piechart = d3
    .select("#piechart")
    .append("svg")
    .attr("width", 500)
    .attr("height", 500);

  const radius = Math.min(500, 500) / 2;
  const color = d3.scaleOrdinal(d3.schemeCategory10);
  const pie = d3.pie().value((d) => d.count);
  const arc = d3.arc().innerRadius(0).outerRadius(radius);

  const g = piechart
    .append("g")
    .attr("transform", `translate(${radius},${radius})`);

  g.selectAll("arc")
    .data(pie(pieChartData))
    .enter()
    .append("path")
    .attr("d", arc)
    .attr("fill", (d, i) => color(i));

  g.selectAll("text")
    .data(pie(pieChartData))
    .enter()
    .append("text")
    .attr("transform", (d) => {
      let [x, y] = arc.centroid(d);
      y -= 15; 
      x -= 10;
      return `translate(${x},${y})`;
    })
    .attr("text-anchor", "middle")
    .attr("font-size", "10px")
    .text((d) => d.data.label);
});
