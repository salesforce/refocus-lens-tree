# refocus-lens-tree

Note: This repository is infrequently maintained.

## CollapsibleTree

A collapsible and searchable tree. NOT REALTIME--refresh the page for current status. Useful for browsing the hierarchy.

![Sample](/sample.png)

### Setup

1. Git clone this repo.

        git clone https://github.com/salesforce/refocus-lens-tree

1. Install the Refocus Lens Developer Kit.

        git clone https://github.com/salesforce/refocus-ldk
        cd refocus-ldk
        npm install

1. Copy this lens into your `refocus-ldk/Lenses` directory.

        cp -r ../refocus-lens-tree/CollapsibleTree Lenses

1. Configure the Refocus LDK.

        npm config set refocus-ldk:lens CollapsibleTree

### Test

Run the Refocus LDK's `test` script to run all the tests under `refocus-ldk/Lenses/CollapsibleTree/test`.

```
npm run test
```

### Build

Run the Refocus LDK's `build` script to generate the lens library (`refocus-ldk/dist/CollapsibleTree.zip`).

```
npm run build
```

### Deploy

Use the Refocus UI or API (`/v1/lenses`) to deploy the lens.

# TODO
1. handle refocus.lens.realtime.* events
1. search enhancement to boost exact name match
1. misc
  1. add legend
  1. swap in a stronger "OK" color
  1. flesh out the content in the "details" panel
  1. add "loaded on ..." message
  1. if a node has only one child, auto-expand the child when you expand the node
  1. if a node has only one descendent in a non-good state, auto-expand to that descendent when you expand the node
