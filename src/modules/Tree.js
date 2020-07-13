import React, { Component } from 'react'
import '../css/Tree.css'

var d3 = require('d3')


const TEST_DATA = {
    'branchset': [
        { 'branchset': [ {'name': 'Harry'}, {'name': 'Sally'} ] },
        { 'branchset': [ {'name': 'Pink'}, {'name': 'Floyd'} ] },
    ]
}

const width = 750
const outerRadius = width / 2
const innerRadius = outerRadius * .60

function linkStep(startAngle, startRadius, endAngle, endRadius) {
    const c0 = Math.cos(startAngle = (startAngle - 90) / 180 * Math.PI);
    const s0 = Math.sin(startAngle);
    const c1 = Math.cos(endAngle = (endAngle - 90) / 180 * Math.PI);
    const s1 = Math.sin(endAngle);
    return "M" + startRadius * c0 + "," + startRadius * s0
        + (endAngle === startAngle ? "" : "A" + startRadius + "," + startRadius + " 0 0 " + (endAngle > startAngle ? 1 : 0) + " " + startRadius * c1 + "," + startRadius * s1)
        + "L" + endRadius * c1 + "," + endRadius * s1;
}

function linkExtensionConstant(d) {
    return linkStep(d.target.x, d.target.y, d.target.x, innerRadius);
}

function linkExtensionVariable(d) {
    return linkStep(d.target.x, d.target.radius, d.target.x, innerRadius);
}

function linkConstant(d) {
    return linkStep(d.source.x, d.source.y, d.target.x, d.target.y);
}

function linkVariable(d) {
    return linkStep(d.source.x, d.source.radius, d.target.x, d.target.radius);
}

function setRadius(d, y0, k) {
    d.radius = (y0 += 1) * k;
    if (d.children) d.children.forEach(d => setRadius(d, y0, k));
}

function setColor(d) {
    d.color = "#555555";
    if (d.children) d.children.forEach(setColor);
  }

const cluster = d3.cluster()
    .size([360, innerRadius])
    .separation((a, b) => 1)

class Tree extends Component {
    constructor(props) {
        super(props)
        this.createDendrogram = this.createDendrogram.bind(this)
    }

    componentDidMount() {
        this.createDendrogram()
    }

    componentDidUpdate() {
        this.createDendrogram()
    }

    createDendrogram() {
        const dom_node = this.dom_node
        const root = d3.hierarchy(TEST_DATA, d => d.branchset)
            .sum(d => d.branchset ? 0 : 1)
            .sort((a ,b) => (a.value - b.value) || d3.ascending(a.data.length, b.data.length))
        cluster(root);
        setRadius(root, root.data.length =0, innerRadius)
        setColor(root)

        d3.select(dom_node)
            .attr('font-family', 'sans-serif')
            .attr('font-size', 7)

        d3.select(dom_node).selectAll("svg > *").remove();


        const linkExtension = d3.select(dom_node)
            .append('g')
            .attr('fill', 'none')
            .attr('stroke', '#555555')
            .attr('stroke-opacity', 0.25)
            .selectAll('path')
            .data(root.links().filter(d => !d.target.children))
            .join('path')
            .each(function(d) {d.target.linkExtensionNode = this; })
            .attr("d", linkExtensionConstant)

        const link = d3.select(dom_node)
            .append('g')
            .attr('fill', 'none')
            .attr('stroke', '#555555')
            .selectAll('path')
            .data(root.links())
            .join('path')
            .each(function(d) {d.target.linkNode = this;})
            .attr('d', linkConstant)

        d3.select(dom_node)
            .append('g')
            .selectAll('circle')
            .data(root.descendants())
            .join('circle')
            .attr('transform', d => `rotate(${d.x - 90}) translate(${d.y}, 0)`)
            .attr('r', 5)
            .attr('fill', '#330033')
            .on('click', this.props.setActiveNode)

        d3.select(dom_node)
            .append('g')
            .selectAll('text')
            .data(root.leaves())
            .join('text')
                .attr('dy', '.31em')
                .attr('transform', d => `rotate(${d.x - 90}) translate(${innerRadius + 6},0) ${d.x < 180 ? "" : "rotate(180)"}`)
                .attr('text-anchor', d => d.x < 180 ? "start" : "end")
                .text(d => d.data.name.replace(/_/g, " "))
                .on("mouseover", mouseovered(true))
                .on("mouseout", mouseovered(false))

        function update(checked) {
            const t = d3.transition().duration(750);
            linkExtension.transition(t).attr('d', checked ? linkExtensionVariable : linkExtensionConstant)
            link.transition(t).attr('d', checked ? linkVariable : linkConstant)
        }

        function mouseovered(active) {
            return function(d) {
                d3.select(this).classed("label--active", active);
                d3.select(d.linkExtensionNode).classed("link-extension--active", active).raise();
                do d3.select(d.linkNode).classed("link--active", active).raise();
                while (d = d.parent)
            }
        }

        return Object.assign(dom_node, {update})
    }

    render() {
        return (
            <div className="Tree">
                <svg viewBox="-250 -250 500 500"
                     height="100%"
                     preserveAspectRatio="xMidYMid meet"
                     ref={dom_node => this.dom_node = dom_node}/>
            </div>
        )
    }

}

export default Tree