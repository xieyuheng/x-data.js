import { type Data } from "../data/index.ts"

export function formatData(data: Data): string {
  switch (data.kind) {
    case "Bool": {
      if (data.content) {
        return "#t"
      } else {
        return "#f"
      }
    }

    case "Symbol": {
      return `'${data.content}`
    }

    case "String": {
      return JSON.stringify(data.content)
    }

    case "Int": {
      return data.content.toString()
    }

    case "Float": {
      if (Number.isInteger(data.content)) {
        return `${data.content.toString()}.0`
      } else {
        return data.content.toString()
      }
    }

    case "Tael": {
      const elements = data.elements.map(formatData)
      const attributes = Object.entries(data.attributes).map(
        ([k, e]) => `:${k} ${formatData(e)}`,
      )
      if (elements.length === 0 && attributes.length === 0) {
        return `[]`
      } else if (attributes.length === 0) {
        return `[${elements.join(" ")}]`
      } else if (elements.length === 0) {
        return `[${attributes.join(" ")}]`
      } else {
        return `[${elements.join(" ")} ${attributes.join(" ")}]`
      }
    }
  }
}
