draw = () => {
    const nodesN = 400
    const edgesN = 300
    const groupsN = 8

    const groups = []
    for (let i = 0; i < groupsN; i++) {
        groups.push(i)
    }

    const visNodes = []

    for (let i = 0; i < nodesN; i++) {
        visNodes.push({
            id: i,
            label: 'Node ' + i,
            group: groups[randomInt(0, groups.length - 1)]
        })
    }    
    
    const visEdges = []

    for (let i = 0; i < edgesN; i++) {
        visEdges.push({
            id: i, from: randomInt(0, nodesN), to: randomInt(0, nodesN)
        })
    }

    nodes = new vis.DataSet()
    edges = new vis.DataSet()
    edges.add(visEdges)

    computeNodesPositionsDistricts(visNodes, groups)
    nodes.add(visNodes)

    var container = document.getElementById('districts-network')

    var data = {
        nodes: nodes,
        edges: edges
    }
    var options = {
        physics:
        {
            enabled: false
        }
    }
    network = new vis.Network(container, data, options)

    network.on('afterDrawing', (ctx) => afterNetworkDrawing(network, ctx))
}

afterNetworkDrawing = (network, ctx) => {
    const groupsPoints = {}
    for (const node of network.body.data.nodes.get()) {
        const nodePosition = network.getPositions([node.id])
        if (nodePosition[node.id]) {
            if (!groupsPoints[node.group]) groupsPoints[node.group] = []
            groupsPoints[node.group].push({ x: nodePosition[node.id].x, y: nodePosition[node.id].y })
        }
    }

    ctx.lineWidth = 5

    for (const group in groupsPoints) {
        const convexPoints = convexHull(groupsPoints[group])
        const groupColor = network.groups.groups[group].color.background

        ctx.fillStyle = setRGBAColorAlpha(groupColor, 0.2)
        ctx.beginPath()
        ctx.moveTo(convexPoints[0].x, convexPoints[0].y)
        for (let i = 1; i < convexPoints.length; i++) {
            ctx.lineTo(convexPoints[i].x, convexPoints[i].y)
        }
        ctx.closePath()
        ctx.fill()

        ctx.strokeStyle = this.setRGBAColorAlpha(groupColor, 0.3)
        ctx.stroke()
    }
}