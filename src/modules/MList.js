import React, { Component } from 'react'
import '../css/MList.css'


const mention_limit = 100


const render_leaves = (leaf, i) => (
    <li className="list-group-item" key={i}>
        <b>Name: </b> {leaf.data.name ? leaf.data.name : 'N/A'} <br/>
        <b>CUI: </b> {leaf.data.cui ? leaf.data.cui : 'N/A'} <br/>
        <b>PMID: </b> {leaf.data.pmid ? leaf.data.pmid : 'N/A'} <br/>
        <b>Topic: </b> {leaf.data.topic ? leaf.data.topic : 'N/A'} <br/>
        <b>Mention: </b> {leaf.data.mention ? leaf.data.mention : 'N/A'} <br/>
    </li>
)

class MList extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        const activeNode = this.props.activeNode;
        const leaves = activeNode ? activeNode.leaves() : []

        return (
            <div className="MList">
                <ul className="list-group">
                    {leaves.slice(0, mention_limit).map(render_leaves)}
                </ul>
            </div>
        )
    }
}

export default MList