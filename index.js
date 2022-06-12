import fs from 'fs'
import path from 'path'
import parser from '@babel/parser'
import traverse from '@babel/traverse'

function createAssets (filePath) {
  const source = fs.readFileSync(filePath, 'utf-8')
  const ast = parser.parse(source, {
    sourceType: 'module'
  })

  const deps = []

  traverse.default(ast, {
    ImportDeclaration ({ node }) {
      deps.push(node.source.value)
    }
  })
  
  return {
    filePath,
    source,
    deps
  }
}

function createGraph () {
  const mainAssets = createAssets('./example/main.js')
  console.log(mainAssets)
  const queue = [mainAssets]
  for (const asset of queue ) {
    asset.deps.forEach((relativePath) => {
      const childAsset = createAssets(path.resolve('./example', relativePath))
      console.log(childAsset)
    })
  }
}

createGraph()
