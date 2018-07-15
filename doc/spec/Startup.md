# Hyperspace.app Startup Behaviour Specification

## Introduction

This specification outlines the desired behaviour of Hyperspace.app when it first launches.

## Desired Functionality

### Main Process
- Initialize electron's main window.  Register applicable event listeners (`close`, `closed`, etc), and load the renderer's entrypoint `index.html`. 

### Renderer Process
- Display a loading screen until communication with an active `hsd` has been established.
- Disable the loading screen and initialize the plugin system.
