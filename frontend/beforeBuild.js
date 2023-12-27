const { exec } = require('child_process')
const fs = require('fs')
const path = require('path')
const readline = require('readline')

const compileProtofiles = () => {
  return new Promise((resolve, reject) => {
    exec('echo "compile-protofiles START" && npx pbjs -t static-module -w es6 --no-comments --lint "eslint-disable block-scoped-var, id-length, no-control-regex, no-magic-numbers, no-prototype-builtins, no-redeclare, no-shadow, no-var, sort-vars, camelcase, default-case-last, no-mixed-operators" -o src/flipper-js/protobufCompiled.js ./flipperzero-protobuf/*.proto && npx eslint --fix src/flipper-js/protobufCompiled.js && echo "compile-protofiles END"', (err, stdout, stderr) => {
      if (err) {
        reject(err)
      }
      if (stderr) {
        console.error(stderr)
      }
      resolve()
    })
  })
}

const walk = (dir, done) => {
  let results = []
  fs.readdir(dir, (err, list) => {
    if (err) return done(err)
    let i = 0;
    (function next () {
      let file = list[i++]
      if (!file) return done(null, results)
      file = path.resolve(dir, file)
      fs.stat(file, (err, stat) => {
        if (err) {
          console.error(err)
          return
        }
        if (stat && stat.isDirectory()) {
          walk(file, (err, res) => {
            if (err) {
              console.error(err)
              return
            }
            results = results.concat(res)
            next()
          })
        } else {
          results.push(file)
          next()
        }
      })
    })()
  })
}
const walkPromise = (dir) => {
  return new Promise((resolve, reject) => {
    walk(dir, (err, result) => {
      if (err) {
        reject(err)
      }
      resolve(result)
    })
  })
}
const copyPromise = (src, dest) => {
  return new Promise((resolve, reject) => {
    fs.copyFile(src, dest, (err) => {
      if (err) {
        reject(err)
      }
      resolve()
    })
  })
}
const getFirstLine = async (pathToFile) => {
  const readable = fs.createReadStream(pathToFile)
  const reader = readline.createInterface({ input: readable })
  const line = await new Promise((resolve) => {
    reader.on('line', (line) => {
      reader.close()
      resolve(line)
    })
  })
  readable.close()
  return line
}

const moveWorkers = async () => {
  const result = await walkPromise(path.join(__dirname, 'src'))
  const workersList = result.filter(e => e.endsWith('worker.js')).map(e => e.slice(e.indexOf('frontend/src') + 9))
  const dependencies = new Set()

  await fs.promises.mkdir('src-electron/extraResources/workers/', { recursive: true })

  for (const workerPath of workersList) {
    const workerDir = workerPath.slice(0, workerPath.lastIndexOf('/'))
    const fileName = workerPath.slice(workerPath.lastIndexOf('/') + 1)
    const dest = 'src-electron/extraResources/workers/' + fileName
    const absolutePath = path.join(__dirname, workerPath)
    const absoluteDest = path.join(__dirname, dest)

    const firstLine = await getFirstLine(absolutePath)
    if (firstLine.startsWith('// dependencies: ')) {
      const workerDependencies = JSON.parse(firstLine.slice(17))
      for (const workerDependency of workerDependencies) {
        dependencies.add(path.join(workerDir, workerDependency))
      }
    }

    await copyPromise(absolutePath, absoluteDest)
  }

  for (const dependency of dependencies) {
    const fileName = dependency.slice(dependency.lastIndexOf('/') + 1)
    const dest = 'src-electron/extraResources/workers/' + fileName
    copyPromise(path.join(__dirname, dependency), path.join(__dirname, dest))
  }
}

module.exports = {
  compileProtofiles,
  moveWorkers
}
