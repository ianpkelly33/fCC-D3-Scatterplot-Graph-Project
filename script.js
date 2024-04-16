document.addEventListener("DOMContentLoaded", () => {
    const url = "https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/cyclist-data.json";
    req = new XMLHttpRequest();
    req.open("GET", url, true);
    req.send();
    req.onload = () => {
        const dataset = JSON.parse(req.responseText);

        const yearData = [];
        const timeData = [];
        for (let i = 0; i < dataset.length; i++) {
            date = new Date(null);
            date.setMinutes(dataset[i].Seconds / 60);
            date.setSeconds(dataset[i].Seconds % 60);
            timeData.push(date);
            yearData.push(new Date(dataset[i].Year, 1));
        };

        const fullWidth = 800;
        const fullHeight = 600;
        const padding = 50;
        const w = fullWidth - 2 * padding;
        const h = fullHeight - 2 * padding;

        const maxX = d3.max(yearData, d => d);
        const minX = d3.min(yearData, d => d);
        const maxY = d3.max(timeData, d => d);
        const minY = d3.min(timeData, d => d);

        const xScale = d3.scaleUtc()
            .domain([minX, maxX])
            .rangeRound([padding, w])
            .nice();
        const yScale = d3.scaleUtc()
            .domain([maxY, minY])
            .rangeRound([h, padding])
            .nice();

        const svg = d3.select(".visHolder")
            .append("svg")
            .attr("width", fullWidth)
            .attr("height", fullHeight);
        const tooltip = d3.select("body")
            .append("div")
            .attr("id", "tooltip")
            .style("opacity", 0)
            .style("color", "white");

        svg.selectAll("circle")
            .data(dataset)
            .enter()
            .append("circle")
            .attr("data-xvalue", (d, i) => yearData[i])
            .attr("data-yvalue", (d, i) => timeData[i])
            .attr("cx", (d, i) => xScale(yearData[i]))
            .attr("cy", (d, i) => yScale(timeData[i]))
            .attr("r", 5)
            .style("fill", d => {
                if (d.Doping == "") {
                    return "white";
                } else {
                    return "maroon";
                }
            })
            .attr("class", "dot")
            .on("mouseover", (d, i) => tooltip.attr("data-year", yearData[i])
                .html(d.Name + " : " + d.Nationality + "<br/>Year: " + d.Year + " Time: " + d.Time + "<br/>" + d.Doping)
                .style("opacity", 1))
            .on("mouseout", d => tooltip.style("opacity", 0));

        const legend = svg.selectAll("#legend")
            .data(dataset)
            .enter()
            .append("g")
            .attr("id", "legend");
        legend.append("circle")
            .attr("cx", 0.1 * fullWidth)
            .attr("cy", fullHeight - padding)
            .attr("r", 5)
            .attr("fill", "white");
        legend.append("circle")
            .attr("cx", 0.1 * fullWidth)
            .attr("cy", fullHeight - padding + 40)
            .attr("r", 5)
            .attr("fill", "maroon");
        legend.append("text")
            .attr("x", 0.1 * fullWidth + 10)
            .attr("y", fullHeight - padding + 5)
            .style("fill", "white")
            .text("No Doping Allegations");
        legend.append("text")
            .attr("x", 0.1 * fullWidth + 10)
            .attr("y", fullHeight - padding + 45)
            .style("fill", "white")
            .text("Riders With Doping Allegations");

        const xAxis = d3.axisBottom(xScale);
        const yAxis = d3.axisLeft(yScale);

        svg.append("g")
            .attr("transform", "translate(0," + (h) + ")")
            .attr("id", "x-axis")
            .call(xAxis);
        svg.append("g")
            .attr("transform", "translate(" + padding + ",0)")
            .attr("id", "y-axis")
            .call(yAxis
                .tickFormat(d3.utcFormat("%M:%S"))
                .tickPadding(10)
            );
    }
});
