function generateGraph(data){
    var width = 600,
    height = ((data.Nodes.length*10)),
    boxWidth = 150,
    boxHeight = 20,
    gap = {
        width: 150,
        height: 12
    },
    margin = {
        top: 16,
        right: 16,
        bottom: 16,
        left: 16
    },
    svg;

    if(data.Nodes.length>2000){
        height = ((data.Nodes.length)*((gap.height+boxHeight+0.3)/2))
    }
    if(data.Nodes.length>1000&&data.Nodes.length<2000){
        height = ((data.Nodes.length)*((gap.height+boxHeight+29.5)/2))
    }
    if(data.Nodes.length<1000){
        height = ((data.Nodes.length)*((gap.height+boxHeight+10)/2))
    }
    svg = d3.select("#tree").append("xhtml:div").attr("id", "mydiv").append("svg").attr("width", width).attr("height", height)
    .append("g").attr("transform", "translate("+ margin.left + "," + margin.top + ")");

// test layout
var Nodes = [];
var links = [];
var lvlCount = 0;

var diagonal = function link(d) {
    "use strict";
  return "M" + d.source.y + "," + d.source.x
      + "C" + (d.source.y + d.target.y) / 2 + "," + d.source.x
      + " " + (d.source.y + d.target.y) / 2 + "," + d.target.x
      + " " + d.target.y + "," + d.target.x;
};


function find(text) {
    "use strict";
    var i;
    for (i = 0; i < Nodes.length; i += 1) {
        if (Nodes[i].name === text) {
            return Nodes[i];
        }
    }
    return null;
}

function mouse_action(val, stat, direction) {
    "use strict";
    d3.select("#" + val.id).classed("active", stat);
    
    links.forEach(function (d) {
        if (direction == "root") {
            if (d.source.id === val.id) {
                d3.select("#" + d.id).classed("activelink", stat); // change link color
                d3.select("#" + d.id).classed("link", !stat); // change link color
                if (d.target.lvl < val.lvl)
                    mouse_action(d.target, stat, "left");
                else if (d.target.lvl > val.lvl)
                    mouse_action(d.target, stat, "right");
            }
            if (d.target.id === val.id) {
                d3.select("#" + d.id).classed("activelink", stat); // change link color
                d3.select("#" + d.id).classed("link", !stat); // change link color
                if (direction == "root") {
                    if(d.source.lvl < val.lvl)
                        mouse_action(d.source, stat, "left");
                    else if (d.source.lvl > val.lvl)
                        mouse_action(d.source, stat, "right");
                }
            }
        }else if (direction == "left") {
            if (d.source.id === val.id && d.target.lvl < val.lvl) {
                d3.select("#" + d.id).classed("activelink", stat); // change link color
                d3.select("#" + d.id).classed("link", !stat); // change link color

                mouse_action(d.target, stat, direction);
            }
            if (d.target.id === val.id && d.source.lvl < val.lvl) {
                d3.select("#" + d.id).classed("activelink", stat); // change link color
                d3.select("#" + d.id).classed("link", !stat); // change link color
                mouse_action(d.source, stat, direction);
            }
        }else if (direction == "right") {
            if (d.source.id === val.id && d.target.lvl > val.lvl) {
                d3.select("#" + d.id).classed("activelink", stat); // change link color
                d3.select("#" + d.id).classed("link", !stat); // change link color
                mouse_action(d.target, stat, direction);
            }
            if (d.target.id === val.id && d.source.lvl > val.lvl) {
                d3.select("#" + d.id).classed("activelink", stat); // change link color
                d3.select("#" + d.id).classed("link", !stat); // change link color
                mouse_action(d.source, stat, direction);
            }
        }
    });
}

function unvisite_links() {
    "use strict";
    links.forEach(function (d) {
        d.visited = false;
    });
}

function renderRelationshipGraph(data) {
    "use strict";
    var count = [];

    data.Nodes.forEach(function (d) {
        count[d.lvl] = 0;
    });
    lvlCount = count.length;

    data.Nodes.forEach(function (d, i) {
        d.x = margin.left + d.lvl * (boxWidth + gap.width);
        d.y = margin.top + (boxHeight + gap.height) * count[d.lvl];
        d.id = "n" + i;
        count[d.lvl] += 1;
        Nodes.push(d);
    });

    data.links.forEach(function (d) {
        links.push({
            source: find(d.source),
            target: find(d.target),
            id: "l" + find(d.source).id + find(d.target).id
        });
    });
    unvisite_links();

    svg.append("g")
        .attr("class", "nodes");

    var node = svg.select(".nodes")
        .selectAll("g")
        .data(Nodes)
        .enter()
        .append("g")
        .attr("class", "unit");

    node.append("rect")
        .attr("x", function (d) { return d.x; })
        .attr("y", function (d) { return d.y; })
        .attr("id", function (d) { return d.id; })
        .attr("width", boxWidth)
        .attr("height", boxHeight)
        .attr("class", "node")
        .attr("rx", 6)
        .attr("ry", 6)
        .on("mouseover", function () {
            mouse_action(d3.select(this).datum(), true, "root");
            unvisite_links();
        })
        .on("mouseout", function () {
            mouse_action(d3.select(this).datum(), false, "root");
            unvisite_links();
        });

    node.append("text")
        .attr("class", "label")
        .attr("x", function (d) { return d.x + 14; })
        .attr("y", function (d) { return d.y + 15; })
        .text(function (d) { return d.name; });

    links.forEach(function (li) {
        svg.append("path", "g")
            .attr("class", "link")
            .attr("id", li.id)
            .attr("d", function () {
                var oTarget = {
                    x: li.target.y + 0.5 * boxHeight,
                    y: li.target.x
                };
                var oSource = {
                    x: li.source.y + 0.5 * boxHeight,
                    y: li.source.x
                };
                
                if (oSource.y < oTarget.y) {
                    oSource.y += boxWidth;
                } else {
                    oTarget.y += boxWidth;
                }
                return diagonal({
                    source: oSource,
                    target: oTarget
                });
            });
    });
}


    renderRelationshipGraph(data);
}

