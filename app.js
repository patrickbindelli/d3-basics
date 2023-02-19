const draw = async () => {
  //Data
  const dataset = await d3.json("data.json");

  const xAcessor = (d) => d.currently.humidity;

  const yAcessor = (d) => d.currently.temperature;

  //Dimensions
  let dimensions = {
    width: 800,
    height: 800,
    margin: {
      top: 50,
      bottom: 50,
      left: 50,
      right: 50,
    },
    ctrWidth: null,
    ctrHeight: null,
  };

  dimensions.ctrWidth =
    dimensions.width - dimensions.margin.left - dimensions.margin.right;

  dimensions.ctrHeight =
    dimensions.height - dimensions.margin.top - dimensions.margin.bottom;

  // Draw Image
  const svg = d3
    .select("#chart")
    .append("svg")
    .attr("width", dimensions.width)
    .attr("height", dimensions.height);

  const ctr = svg
    .append("g")
    .attr(
      "transform",
      `translate(${dimensions.margin.left}, ${dimensions.margin.top})`
    );

  // Scales
  const xScale = d3
    .scaleLinear()
    .domain(d3.extent(dataset, xAcessor))
    .rangeRound([0, dimensions.ctrWidth])
    .clamp(true);

  const yScale = d3
    .scaleLinear()
    .domain(d3.extent(dataset, yAcessor))
    .rangeRound([dimensions.ctrHeight, 0])
    .nice()
    .clamp(true);

  // Draw cricles
  ctr
    .selectAll("circle")
    .data(dataset)
    .join("circle")
    .attr("cx", (d) => xScale(xAcessor(d)))
    .attr("cy", (d) => yScale(yAcessor(d)))
    .attr("r", 5)
    .attr("fill", "blue")
    .attr("data-temp", yAcessor);

  // Axes
  const xAxis = d3.axisBottom(xScale);

  const xAxisGroup = ctr
    .append("g")
    .call(xAxis)
    .style("transform", `translateY(${dimensions.ctrHeight}px)`)
    .classed("axis", true);

  xAxisGroup
    .append("text")
    .attr("x", dimensions.ctrWidth / 2)
    .attr("y", dimensions.margin.bottom - 10)
    .attr("fill", "black")
    .text("Humidity");

  const yAxis = d3.axisLeft(yScale);

  const yAxisGroup = ctr.append("g").call(yAxis).classed("axis", true);

  yAxisGroup
    .append("text")
    .attr("x", -dimensions.ctrHeight / 2)
    .attr("y", -dimensions.margin.left + 15)
    .attr("fill", "black")
    .html("Temperature &deg; F")
    .style("transform", `rotate(270deg)`)
    .style("text-anchor", "middle");
};

draw();
