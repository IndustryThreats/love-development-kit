# love-development-kit

## ⚠️ LDK is undergoing a major refactor, read more [here](./doc/0.3-REFACTOR.md)).

The Swiss Army knife for creating and distributing LOVE2D games.

## Getting Started

Create a new LOVE2D project;
```sh
ldk init [project-name]
```

To bundle:

```bash
# The resulting bundle will be located in the build directory.
ldk bundle
```

To bundle, then run (useful for development);
```sh
ldk dev
```

Using luarocks in you're game? LDK supports it!
Just edit you're ldk.project.json and add these fields;
> Note: C Modules will not work with LOVE2D. Make sure your modules are pure lua!
```jsonc
{
    "luaversion": "MAJOR.MINOR", //
    "luarocks": true
}
```

Now just require from the lib directory!
```lua
local rock = require("lib.rock")
```

## Planned Features

* build subcommand to fuse games for Windows and Linux.
* configuration of zip layout
* hotreload
* standard library (camera, actor, vector, etc)

