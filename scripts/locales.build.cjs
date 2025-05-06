#!/usr/bin/env node
/* eslint-disable no-console */
/* eslint-disable node/prefer-global/process */

const fs = require('node:fs')
const path = require('node:path')
const yaml = require('js-yaml')
const chokidar = require('chokidar')

// Configuration
const workspaceDir = path.resolve(__dirname, '..')
const srcDir = path.join(workspaceDir, 'locales-src')
const destDir = path.join(workspaceDir, 'locales')
const watch = process.argv.includes('--watch')

// Ensure destination directory exists
if (!fs.existsSync(destDir)) {
  fs.mkdirSync(destDir, { recursive: true })
}

/**
 * Convert a YAML file to JSON
 * @param {string} srcFile - Source YAML file path
 */
function convertFile(srcFile) {
  const relativePath = path.relative(srcDir, srcFile)
  const destFile = path.join(
    destDir,
    relativePath.replace(/\.ya?ml$/i, '.json'),
  )

  // Read YAML file
  const yamlContent = fs.readFileSync(srcFile, 'utf8')

  // Parse YAML to JSON
  const objectContent = yaml.load(yamlContent)

  // Write JSON file
  // eslint-disable-next-line prefer-template
  fs.writeFileSync(destFile, JSON.stringify(objectContent, null, 2) + '\n')

  console.log(`Converted: ${relativePath} -> ${path.relative(__dirname, destFile)}`)
}

/**
 * Process all YAML files in the directory
 */
function buildAll() {
  console.log(`Building all locale files from ${path.relative(__dirname, srcDir)} to ${path.relative(__dirname, destDir)}...`)

  const processDir = (dir) => {
    const entries = fs.readdirSync(dir, { withFileTypes: true })

    for (const entry of entries) {
      const fullPath = path.join(dir, entry.name)

      if (entry.isFile() && entry.name.endsWith('.yaml')) {
        convertFile(fullPath)
      }
    }
  }

  processDir(srcDir)
  console.log('Build completed')
}

buildAll()

if (watch) {
  console.log(`Watching for changes in ${path.relative(__dirname, srcDir)}...`)

  chokidar
    .watch(srcDir, {
      ignoreInitial: true,
    })
    .on('add', convertFile)
    .on('change', convertFile)
}
