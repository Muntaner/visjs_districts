partitionateRegion = (groups = [], REGION_RANGE = 100, REGIONS_DISTANCE_MULTIPLIER = 2.0) => {
    const angleSlice = 360 / groups.length
    let targetAngle = 0
    const partitions = {}
    for (let i = 0; targetAngle < 360; i++) {
        partitions[groups[i]] = {
            x: Math.cos(targetAngle * (Math.PI / 180)) * (REGIONS_DISTANCE_MULTIPLIER * REGION_RANGE * groups.length),
            y: Math.sin(targetAngle * (Math.PI / 180)) * (REGIONS_DISTANCE_MULTIPLIER * REGION_RANGE * groups.length)
        }
        targetAngle += angleSlice
    }
    return partitions
}

getContourPoint = (center, range, angleIndex, MIN_RANGE = 10, MAX_RANGE = 100, RANGE_MULTIPLIER = 10) => {
    const angleSlice = 360 / range
    const tamperedRange = range < MIN_RANGE ? MIN_RANGE : range > MAX_RANGE ? MAX_RANGE : range
    let targetAngle = angleSlice * angleIndex
    return {
        x: center.x + Math.cos(targetAngle * (Math.PI / 180)) * (tamperedRange * RANGE_MULTIPLIER),
        y: center.y + Math.sin(targetAngle * (Math.PI / 180)) * (tamperedRange * RANGE_MULTIPLIER)
    }
}

computeNodesPositionsDistricts = (nodes, groups) => {
    const groupsNodes = {}
    const groupsRegions = {}
    
    const partitionsCenters = partitionateRegion(groups)

    for (const node of nodes) {
        const group = node.group
        const nodeId = node.id

        if (!groupsNodes[group])
            groupsNodes[group] = []
        groupsNodes[group].push(nodeId)
        
        if (!groupsRegions[group]) {
            groupsRegions[group] = {
                center: partitionsCenters[group],
                size: 1
            }
        } else {
            groupsRegions[group].size++
        }
    }

    for (const node of nodes) {
        const nodePos = getContourPoint(
            groupsRegions[node.group].center,
            groupsRegions[node.group].size,
            groupsNodes[node.group].indexOf(node.id)
        )
        node.x = nodePos.x
        node.y = nodePos.y
    }

    return nodes
}