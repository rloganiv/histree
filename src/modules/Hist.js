import React, { Component } from 'react'
import '../css/Hist.css'

var d3 = require('d3')


class Hist extends Component {
    constructor(props) {
        super(props)
        this.createBarChart = this.createBarChart.bind(this)
    }

    componentDidMount() {
        this.createBarChart()
    }

    componentDidUpdate() {
        this.createBarChart()
    }

    createBarChart() {
        const [width, height] = [600, 150]
        const color = "steelblue"
        const margin = {top: 30, right: 0, bottom: 30, left: 40}
        const dom_node = this.dom_node
        const dist = this.props.activeNode ? this.props.activeNode.dist : null

        if (!dist) return;  // Terminate early if no data to plot

        const x = d3.scaleBand()
            .domain(d3.range(dist.length))
            .range([margin.left, width - margin.right])
            .padding(0.1)
        const y = d3.scaleLinear()
            .domain([0, d3.max(dist, d => d.value)]).nice()
            .range([height - margin.bottom, margin.top])
        const xAxis = g => g
            .attr('transform', `translate(0, ${height - margin.bottom})`)
            .call(d3.axisBottom(x))
        const yAxis = g => g
            .attr('transform', `translate(${margin.left}, 0)`)
            .call(d3.axisLeft(y).ticks(null))
            .call(g => g.select('.domain').remove())

        d3.select(dom_node).selectAll("svg > *").remove();

        d3.select(dom_node)
            .append('g')
            .attr('fill', color)
            .selectAll('rect')
            .data(dist)
            .join('rect')
                .attr('x', (d, i) => x(i))
                .attr('y', d => y(d.value))
                .attr('height', d => y(0) - y(d.value))
                .attr('width', x.bandwidth())

        d3.select(dom_node)
            .append('g')
            .call(xAxis)

        d3.select(dom_node)
            .append('g')
            .call(yAxis)

    }

    render() {
        return (
            <div className="Hist">
                <svg viewBox="0 0 600 150"
                     preserveAspectRatio="xMidYMid meet"
                     ref={dom_node => this.dom_node = dom_node}
                     overflow="scroll"/>
            </div>
        )
    }
}

export default Hist