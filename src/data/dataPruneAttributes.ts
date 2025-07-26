import { recordMap } from "../utils/record/recordMap.ts"
import { recordRemoveKeys } from "../utils/record/recordRemoveKeys.ts"
import * as X from "./Data.ts"

export function dataPruneAttributes(data: X.Data, keys: Array<string>): X.Data {
  const attributes = recordMap(
    recordRemoveKeys(data.attributes, keys),
    (data) => dataPruneAttributes(data, keys),
  )

  switch (data.kind) {
    case "Bool": {
      return X.Bool(data.content, attributes)
    }

    case "String": {
      return X.String(data.content, attributes)
    }

    case "Int": {
      return X.Int(data.content, attributes)
    }

    case "Float": {
      return X.Float(data.content, attributes)
    }

    case "List": {
      return X.List(
        data.content.map((data) => dataPruneAttributes(data, keys)),
        attributes,
      )
    }
  }
}
