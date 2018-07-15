# Hyperspace.app Hsd lifecycle specification

## Introduction

The purpose of this spec is to outline the desired behaviour of Hyperspace.app as it relates to starting, stopping, or connecting to an existing Hsd.

## Desired Functionality

- Hyperspace.app should check for the existence of a running daemon on launch, by calling `/daemon/version` using the UI's current config.
If the daemon isn't running, Hyperspace.app should launch a new hsd instance, using the bundled hsd binary.  If a bundled binary cannot be found, prompt the user for the location of their `hsd`.  Hsd's lifetime should be bound to Hyperspace.app, meaning that `/daemon/stop` should be called when Hyperspace.app is exited.
- Alternatively, if an instance of `hsd` is found to be running when Hyperspace.app starts up, Hyperspace.app should not quit the daemon when it is exited.

This behaviour can be implemented without any major changes to the codebase by leveraging the existing `detached` flag.

## Considerations

- Calling `/daemon/version` using the UI's config does not actually tell you whether or not there is an active `hsd` running on the host, since a different `hsd` instance could be running using a bindaddr different than the one specified in `config`.
