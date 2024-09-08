interface XmlElement {
  nodeName: string
  nodeValue?: string
  attributes?: { [key: string]: string }
  childNodes?: XmlNode[]
}

type XmlNode = XmlElement | string

function parseXmlNode(node: any): XmlNode {
  if (node.nodeType === Node.TEXT_NODE) {
    return node.nodeValue?.trim() || ''
  }

  const element: any = {
    nodeName: node.nodeName,
    attributes: {},
    childNodes: []
  }

  const attributes = node.attributes
  if (attributes) {
    for (let i = 0; i < attributes.length; i++) {
      const attribute = attributes[i]
      element.attributes[attribute.nodeName] = attribute.nodeValue || ''
    }
  }

  const children = node.childNodes
  if (children) {
    for (let i = 0; i < children.length; i++) {
      const childNode = children[i]
      element.childNodes?.push(parseXmlNode(childNode))
    }
  }

  return element
}

export function xmlToObject(xmlString: string): XmlNode | undefined {
  const parser = new DOMParser()
  const xmlDoc = parser.parseFromString(xmlString, 'text/xml')
  const rootNode = xmlDoc.documentElement

  if (!rootNode) {
    return undefined
  }

  return parseXmlNode(rootNode)
}
