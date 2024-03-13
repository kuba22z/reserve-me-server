// eslint-disable-next-line @typescript-eslint/no-var-requires
const semver = require('semver')
// eslint-disable-next-line @typescript-eslint/no-var-requires
const engines = require('./package').engines

const version = engines.node
if (!semver.satisfies(process.version, version)) {
  console.log(
    `Required node version ${version} not satisfied with current version ${process.version}.`,
  )
  process.exit(1)
}
