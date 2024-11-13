A script to print a verse or group of verses to the terminal from a give Paratext project

# Installation

- Add `export PTPROJ_PATH=<paratext project folder>` to your bash/zshrc/etc file.
- make sure `node` is installed along with the npm package `usfm-grammar`

# Usage

Usage: `node get_verse_text.js <project> <book> <chaptar-verse ranges>`

Example: `node get_verse_text.js MP1 "GEN 1:1,3:15; GEN 5:4; EXO 5:1"`
