# Hyperspace.app Plugin API Specification

## Introduction

This specification outlines the functionality that Hyperspace.app's plugin API exposes to developers.

## Functionality

The Hyperspace.app Plugin api exposes a simple interface for making API calls to hsd, creating file dialogs, displaying notifications, and displaying error messages.  This interface is assigned to the `window` object of each plugin, and has the following functions:

- `HyperspaceAPI.call()`, a wrapper to the configured `hyperspace.js`'s `.apiCall` function.
- `HyperspaceAPI.config`, the current Hyperspace.app config.
- `HyperspaceAPI.hastingsToSpaceCash`, conversion function from hastings to spacecash.  Returns a `BigNumber` and takes either a `BigNumber` or `string`.
- `HyperspaceAPI.spaceCashToHastings`, conversion function from spacecash to hastings.
- `HyperspaceAPI.openFile(options)`, a wrapper which calls Electron.dialog.showOpenDialog with `options`.
- `HyperspaceAPI.saveFile(options)`, a wrapper which calls Electron.dialog.showSaveDialog with `options`.
- `HyperspaceAPI.showMessage(options)`, a wrapper which calls Electron.showMessageBox with `options`.
- `HyperspaceAPI.showerror(options)`, a wrapper which calls Electron.showErrorBox with `options`.
