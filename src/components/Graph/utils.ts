import { timeIntervals, TimeRanges } from "../../types/types";
import * as d3 from "d3";
import { RefObject } from "react";
import { Price } from "../../types/types";
export const year = (years = 1) => {
	const yearInMilliSeconds = 360 * 24 * 60 * 60 * 1000;
	let currentDate = new Date().getTime();
	let [start, end] = [currentDate - yearInMilliSeconds * years, currentDate];
	return `start=${start}&end=${end}`;
};

export const month = (monthes = 1) => {
	const monthInMilliSeconds = 30 * 24 * 60 * 60 * 1000;
	let currentDate = new Date().getTime();
	let [start, end] = [currentDate - monthInMilliSeconds * monthes, currentDate];
	return `start=${start}&end=${end}`;
};

export const week = (weeks = 1) => {
	const weekInMilliSeconds = 7 * 24 * 60 * 60 * 1000;
	let currentDate = new Date().getTime();
	let [start, end] = [currentDate - weekInMilliSeconds * weeks, currentDate];
	return `start=${start}&end=${end}`;
};

export const day = (days = 1) => {
	const dayInMilliSeconds = 24 * 60 * 60 * 1000;
	let currentDate = new Date().getTime();
	let [start, end] = [currentDate - dayInMilliSeconds * days, currentDate];
	return `start=${start}&end=${end}`;
};
const max = () => {
	const yearInMilliSeconds = 11 * 360 * 24 * 60 * 60 * 1000;
	let currentDate = new Date().getTime();
	let [start, end] = [currentDate - yearInMilliSeconds, currentDate];
	return `start=${start}&end=${end}`;
};
export const getIntervalFromTimeRange = (
	timeRange: TimeRanges
): timeIntervals => {
	switch (timeRange) {
		case "day":
			return "m1";
		case "week":
			return "m15";
		case "month":
			return "h1";
		case "year":
		case "max":
			return "d1";
	}
};
const defaultObj = { day, week, month, year, max };

export default defaultObj;

// Graph

export const renderGraph = function (
	graphRef: RefObject<SVGElement>,
	margin: { top: number; right: number; bottom: number; left: number },
	bodyWidth: number,
	height: number,
	width: number,
	data: Price[]
) {
	// append the svg object to the body of the page
	var svg = d3
		.select(graphRef.current)
		.attr("width", bodyWidth)
		.attr("height", height + margin.top + margin.bottom)
		.append("g")
		.attr("width", bodyWidth)
		.attr("height", height + margin.top + margin.bottom)
		.attr("transform", "translate(" + margin.left + "," + margin.top + ")");
	var x = d3
		.scaleTime()
		.domain(
			d3.extent(data, function (d) {
				return new Date(d.time);
			}) as [Date, Date]
		)
		.range([0, width]);

	svg
		.append("g")
		.attr("transform", "translate(0," + height + ")")
		.call(d3.axisTop(x).ticks(5).tickSize(height))
		.call((g) => g.select(".domain").remove())
		.call((g) =>
			g
				.selectAll(".tick line")
				.attr("stroke-opacity", 0.5)
				.attr("stroke-dasharray", "2,2")
		)

		.call((g) => g.selectAll(".tick text").attr("y", "10"));

	// Add Y axis
	var y = d3
		.scaleLinear()
		.domain([
			d3.min(data, (d) => parseFloat(d.priceUsd))! * 0.995,
			d3.max(data, (d) => parseFloat(d.priceUsd))! * 1.005,
		])
		.range([height, 0]);

	svg
		.append("g")
		.call(d3.axisRight(y).tickSize(width))
		.call((g) => g.select(".domain").remove())
		.call((g) =>
			g
				.selectAll(".tick line")
				.attr("stroke-opacity", 0.5)
				.attr("stroke-dasharray", "2,2")
		)

		.call((g) => g.selectAll(".tick text").attr("x", -40).attr("dy", -4));

	// Add the gradient
	let gradient = svg.append("defs").append("linearGradient");
	gradient.attr("id", "grdient");
	gradient.attr("x1", 0).attr("x2", 0).attr("y1", 0).attr("y2", 1);
	gradient.append("stop").attr("offset", "0%").attr("stop-color", "#19875423");
	gradient.append("stop").attr("offset", "100%").attr("stop-color", "white");
	// Add the area
	svg
		.append("path")
		.datum(
			data.map((e) => [e.time, parseFloat(e.priceUsd)] as [number, number])
		)
		.attr("id", "path")
		.attr("fill", "url(#grdient)")
		.attr(
			"d",
			d3
				.area()
				.x(function (d) {
					return x(d[0]);
				})
				.y0(y(d3.min(data, (d) => parseFloat(d.priceUsd) * 0.995) as number))
				.y1(function (d) {
					return y(d[1]);
				})
		);
	// Add the line
	svg
		.append("path")
		.datum(
			data.map((e) => [e.time, parseFloat(e.priceUsd)] as [number, number])
		)
		.attr("fill", "none")
		.attr("stroke", "#5454dd")
		.attr("stroke-width", 1)
		.attr(
			"d",
			d3
				.line()
				.x(function (d) {
					return x(d[0]);
				})
				.y(function (d) {
					return y(d[1]);
				})
		);
	svg
		.append("rect")
		.attr("id", "wrapper")
		.attr("width", width)
		.attr("height", height)
		.attr("fill", "none")
		.attr("pointer-events", "all");

	const dateBisector = d3.bisector((d: Price) => d.time).center;

	function initGraph(e: MouseEvent) {
		if (svg.select("#toolTip").empty()) {
			var path = d3.path();
			path.moveTo(
				0,
				y(d3.min(data, (d) => parseFloat(d.priceUsd) * 0.995) as number)
			);
			path.lineTo(0, 75);
			path.closePath();
			// g Container
			let tooltipContainer = svg.append("g").attr("id", "tooltipContainer");
			// rect
			tooltipContainer
				.append("rect")
				.attr("width", "50")
				.attr("height", "60")
				.attr("y", "0")
				.attr("x", "0")
				.attr("ry", "5")
				.attr("rx", "5")
				.attr("fill", "white")
				.style("stroke", "#5454dd")
				.style("stroke-width", "1.5")
				.attr("id", "rect");
			// text
			tooltipContainer
				.append("text")
				.attr("id", "price-text")
				.attr("y", "25")
				.attr("x", "0")
				.attr("fill", "black")
				.text(`${Math.floor(e.clientX - 10)} - ${Math.floor(e.clientY)}`);
			// text
			tooltipContainer
				.append("text")
				.attr("id", "date-text")
				.attr("y", "45")
				.attr("x", "0")
				.attr("fill", "black")
				.text(`${Math.floor(e.clientX - 10)} - ${Math.floor(e.clientY)}`);
			svg
				.append("path")
				.attr("d", path.toString())
				.attr("id", "toolTip")
				.attr("stroke", "#f70301")
				.attr("stroke-width", "1.5");
		}
	}
	function initGraphForMobile(e: TouchEvent) {
		if (svg.select("#toolTip").empty()) {
			var path = d3.path();
			path.moveTo(
				0,
				y(d3.min(data, (d) => parseFloat(d.priceUsd) * 0.995) as number)
			);
			path.lineTo(0, 75);
			path.closePath();
			// g Container
			let tooltipContainer = svg.append("g").attr("id", "tooltipContainer");
			// rect
			tooltipContainer
				.append("rect")
				.attr("width", "50")
				.attr("height", "60")
				.attr("y", "0")
				.attr("x", "0")
				.attr("ry", "5")
				.attr("rx", "5")
				.attr("fill", "white")
				.style("stroke", "#5454dd")
				.style("stroke-width", "1.5")
				.attr("id", "rect");
			// text
			tooltipContainer
				.append("text")
				.attr("id", "price-text")
				.attr("y", "25")
				.attr("x", "0")
				.attr("fill", "black")
				.text(
					`${Math.floor(e.touches[0].clientX - 10)} - ${Math.floor(
						e.touches[0].clientY
					)}`
				);
			// text
			tooltipContainer
				.append("text")
				.attr("id", "date-text")
				.attr("y", "45")
				.attr("x", "0")
				.attr("fill", "black")
				.text(
					`${Math.floor(e.touches[0].clientX - 10)} - ${Math.floor(
						e.touches[0].clientY
					)}`
				);
			svg
				.append("path")
				.attr("d", path.toString())
				.attr("id", "toolTip")
				.attr("stroke", "#f70301")
				.attr("stroke-width", "1.5");
		}
	}
	function updateGraph(e: MouseEvent) {
		let index = dateBisector(data, x.invert(e.offsetX - 50));
		let price = data[index].priceUsd;
		let pathData = svg.select("#toolTip").attr("d");
		let newPath = pathData.replace(
			/\d+Z/,
			`${Math.floor(y(parseFloat(price)))}Z`
		);
		let tooltipContainer = svg
			.select("#tooltipContainer")
			.node() as SVGGElement;
		let rect = svg.select("#rect");
		let tooltipContainer_box = tooltipContainer.getBBox();
		rect.attr("width", tooltipContainer_box.width);
		svg.select("#price-text").text(`${parseFloat(data[index].priceUsd)}`);
		svg
			.select("#date-text")
			.text(
				`${d3.timeFormat("%B %d, %Y    %H:%M:%S")(new Date(data[index].time))}`
			);
		svg
			.select("#tooltipContainer")
			.attr(
				"transform",
				`translate(${e.offsetX - 40},${Math.floor(y(parseFloat(price))) - 70})`
			);
		if (e.offsetX - 50 + tooltipContainer_box.width > width) {
			let diff = e.offsetX - 50 + tooltipContainer_box.width - width;
			svg
				.select("#tooltipContainer")
				.attr(
					"transform",
					`translate(${e.offsetX - 40 - tooltipContainer_box.width},${
						Math.floor(y(parseFloat(price))) - 70
					})`
				);
		}

		svg
			.select("#toolTip")
			.attr("d", newPath)
			.attr("transform", `translate(${e.clientX - 66},0)`);
	}
	function updateGraphForMobile(e: TouchEvent) {
		var bcr = (e.target as SVGElement).getBoundingClientRect();
		var offsetX = e.targetTouches[0].clientX - bcr.x;
		var offsetY = e.targetTouches[0].clientY - bcr.y;
		let index = dateBisector(data, x.invert(offsetX));
		let price = data[index].priceUsd;
		let pathData = svg.select("#toolTip").attr("d");
		let newPath = pathData.replace(
			/\d+Z/,
			`${Math.floor(y(parseFloat(price)))}Z`
		);
		let tooltipContainer = svg
			.select("#tooltipContainer")
			.node() as SVGGElement;
		let rect = svg.select("#rect");
		let tooltipContainer_box = tooltipContainer.getBBox();
		rect.attr("width", tooltipContainer_box.width);
		svg.select("#price-text").text(`${parseFloat(data[index].priceUsd)}`);
		svg
			.select("#date-text")
			.text(
				`${d3.timeFormat("%B %d, %Y    %H:%M:%S")(new Date(data[index].time))}`
			);
		svg
			.select("#tooltipContainer")
			.attr(
				"transform",
				`translate(${offsetX + 50},${Math.floor(y(parseFloat(price))) - 70})`
			);
		if (offsetX + tooltipContainer_box.width > width) {
			svg
				.select("#tooltipContainer")
				.attr(
					"transform",
					`translate(${offsetX + 50 - tooltipContainer_box.width},${
						Math.floor(y(parseFloat(price))) - 70
					})`
				);
		}
		if (offsetX > 0 && offsetX < width) {
			svg
				.select("#toolTip")
				.attr("d", newPath)
				.attr("transform", `translate(${e.touches[0].clientX - 66},0)`);
		}
	}
	svg.select("#wrapper").on("mouseenter", (e: MouseEvent) => {
		initGraph(e);
	});
	svg.select("#wrapper").on("touchstart", (e: TouchEvent) => {
		initGraphForMobile(e);
	});
	svg.select("#wrapper").on("mousemove", (e: MouseEvent) => {
		updateGraph(e);
	});
	svg.select("#wrapper").on("touchmove", (e: TouchEvent) => {
		updateGraphForMobile(e);
	});
};
