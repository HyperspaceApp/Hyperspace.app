# [![Hyperspace Logo](https://hspace.app/images/logo_horizontal@128.png)](https://hspace.app/) User Interface

[![Build Status](https://travis-ci.org/NebulousLabs/Sia-UI.svg?branch=master)](https://travis-ci.org/NebulousLabs/Sia-UI)
[![devDependency Status](https://david-dm.org/NebulousLabs/Sia-UI/dev-status.svg)](https://david-dm.org/NebulousLabs/Sia-UI#info=devDependencies)
[![dependencies Status](https://david-dm.org/NebulousLabs/Sia-UI.svg)](https://david-dm.org/NebulousLabs/Sia-UI#info=dependencies)
[![Known Vulnerabilities](https://snyk.io/test/github/NebulousLabs/Sia-UI/badge.svg)](https://snyk.io/test/github/NebulousLabs/Sia-UI)
[![license:mit](https://img.shields.io/badge/license-mit-blue.svg)](https://opensource.org/licenses/MIT)

# A Highly Efficient Decentralized Storage Network

![A snapshot of the file library](/doc/assets/files.png)
This is the user interface for [Hyperspace](https://github.com/HyperspaceApp/Hyperspace), it
is a desktop application based off the
[electron](https://github.com/atom/electron) framework. The ambition behind
this project is to facilitate easy, graphical interaction between users and
the Hyperspace network.

## Prerequisites

- [hsd](https://github.com/HyperspaceApp/Hyperspace)
- [node & npm 6.9.0 LTS](https://nodejs.org/download/)
Earlier node versions may work, but they do not have guaranteed support.
- `libxss` is a required dependency for Electron on Debian, it can be installed with `sudo apt-get install libxss1`.

## Running

[Download your OS's release archive and unzip it](https://github.com/HyperspaceApp/Hyperspace.app/releases)

### OR

Run from source

0. Install dependencies mentioned above
1. Download or `git clone` the repository
2. npm install
3. npm start

## [Contributing](doc/Developers.md)

Read the document linked above to learn more about the application and its technologies.

Take a look at our [issues page](https://github.com/HyperspaceApp/Hyperspace.app/issues)
for a high level view of what objectives we're working on.

If you're the type to jump right into code, simply search through the project
(sans the `node_modules` folder) for the term `TODO:`. If you're on a UNIX
(Linux & OSX) system, run `grep -r 'TODO:' js plugins` in a terminal at the
root level of the project

