const xml2js = require('xml2js');

const parseXML = async (data) => {
  const { documents: { document } } = await xml2js.parseStringPromise(data);
  const persons = document.map(x => x.Person ? x.Person : []).filter(x => x.length > 1)
  const pairs = persons.map(x => makePair(x))
  const personNames = [];
  pairs.map(x => x.map(y => y.map(z => personNames.push(z))))
  const nodes = Array.from(new Set(personNames)).map((x, i) => {
    return {
      name: x,
      id: i + 1
    }
  })
  const arr = [];
  pairs.map(x => x.map(y => arr.push(y)))

  const pairCount = arr.reduce(function (prev, cur) {
    prev[cur] = (prev[cur] || 0) + 1;
    return prev;
  }, {});

  const links = Object.keys(pairCount).map(x => fetchId(nodes, x.split(","), pairCount[x]));


  const newNodes = nodes.map(n => {
    const target = links.filter(l => {
      if (n.id === l.source) {
        return {
          target: l.target,
          type: l.type
        }
      }
    })
    const names = target.map(x => fetchName(x.target, nodes));
    n.connection = names.toString();
    return n;
  })
  return {
    nodes: newNodes,
    links
  }
}
const fetchName = (id, data) => data.filter(x => x.id === id)[0].name;
const fetchId = (bin, array, type) => {
  const source = bin.filter(x => x.name === array[0])
  const target = bin.filter(x => x.name === array[1])
  return {
    source: source[0].id,
    target: target[0].id,
    type
  }
}
const makePair = (array) => {
  const pairs = [];
  for (let i = 0; i < array.length; i++) {
    for (j = i; j < array.length; j++) {
      if (array[i] !== array[j]) {
        pairs.push([array[i], array[j]]);
      }
    }
  }
  return pairs;
}
module.exports = {
  parseXML
}
