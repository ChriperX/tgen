# tgen

## Legend
 - [Install](#install)
    - [npm](#npm)
 - [FAQ](#faq)
    - [What's tgen?](#what's-tgen)
    - [What do i need to install tgen?](#what-do-i-need-to-install-tgen)
    - [What do i need to create plugins?](#what-do-i-need-to-create-plugins)
    - [Ok how do i create my first project with tgen?](#ok-how-do-i-create-my-first-project-with-tgen)
 - [Documentation](#documentation)
    - [Template formatting](#template-formatting)
    - [Common plugin syntax](#common-plugin-syntax)
    - [Parser plugins](#parser-plugins)
    - [Template plugins](#template-plugins)
 - [Template keys syntax](#template-keys-syntax)
    - [create](#create)
    - [commands](#commands)
    - [if](#if)
    - [else](#else)
    - [log](#else)
 - [Contributing](#contributing)

## Install

### npm

```bash
npm i tgen -g

```

## FAQ

### What's tgen?

**tgen** is a templating engine for code projects, written in JavaScript, with plugin support.

### What do i need to install tgen?

[Node.js](https://www.nodejs.org)

And the tools of your favourite language.

### What do i need to create plugins?

Nothing. Only some knowledge about node.js, and the [plugin API](#documentation)

### How do i install plugins?

You can install them directly with tgen, or you can put them in /plugins/templateParser/ or /plugins/parser/.

**NOTE: To figure out in which folder you have to put them, please see the installation guide provided by the plugin creator.**

### How do i install and make templates?

You can install templates directly with tgen, or drop them in **/src/templates/**.

To create templates you need to know how [YAML](https://yaml.org) works, and what [keys](#template-keys-syntax) are and how to use them.

### Ok how do i create my first project with tgen?

```bash
tgen new yourLanguageHere yourProjectNameHere

```

This will execute the template **yourLanguageHere** (you can see what templates you have installed in /src/templates/), creating a
project called **yourProjectNameHere**.

## Documentation

### Template formatting

The templates **must** be indented with spaces, otherwise a YAMLException will be thrown (see [js-yaml](https://www.npmjs.com/package/js-yaml))

### Common plugin syntax

Inside every plugin there can be an **exports.pluginInfo** object that contains information on the plugin.

You can retrieve this information by doing **plugin info pluginName**.

Example:

```js
//declare the pluginInfo object
//examplePlugin is the name of the plugin
exports.pluginInfo = {
    examplePlugin: {
        version: 'v1.0.0',
        author: 'NoName',
        repo: 'none',
        extends: 'here specify what your plugin adds.',
        description: 'example pluginInfo'
    }
}
```

### Parser Plugins

Parser plugins are plugins that add commands to the cli.

To add a parser plugin you have to create a .js file inside /plugins/parser/:
```js
//declare the commands object
//inside commands you have to declare 3 more objects: command, cb, desc
//these use the text-parser syntax
exports.commands = {
    command: 'foo <message>',
    cb: function(element) {
        console.log('   ' + element[1])
    },
    desc: 'Example command for documentation'
}

```

And you are done!

This adds a command foo that takes one parameter and logs it to console.

**NOTE: When writing a plugin, please add a pluginInfo object to your plugin. It's optional, but it's recommended.**

### Template plugins

Template plugins are plugins that add a template key with custom actions.

They can be as **complex** or as **simple** as you want.

Example:

```js
//declare templateKeys object. This holds our custom template keys
exports.templateKeys = {
    log: function(objTree, name, completeObjTree) {
        //objTree is an object that holds everything inside the custom template key.
        //name is the variable that holds the project name
        //completeObjTree is the variable that holds the entire template file.

        for (var i = 0; i <= objTree.length - 1; i++) {
            //loops through the array inside objTree
            console.log('   ' + objTree[i])
        }
    }
}

```

This adds a template key called **log** that can be used as it follows:

```yaml
log:
  - i am logging to the console with the log template key!

```

**NOTE: When writing a plugin, please add a pluginInfo object to your plugin. It's optional, but it's recommended.**

**NOTE: The log plugin is already installed by default. Installed template plugins will be listed whenever a new project is created.**

## Template keys syntax

### create

Creates the files specified in an array, creates a folder if the destination folder doesn't exist.

### commands

Executes commands specified in an array.

**NOTE: Don't use untrusted templates, they can do malicious things with this template key!**

### if

Evaluates a condition in the form of an object, if it evaluates to true then it executes the 

template keys inside of it.

**NOTE: The condition uses the same rules as JS conditions. You can nest multiple conditions that execute separate things.**

### else

Executes the template keys inside of it, only if the last if statement evaluated to false.

### log

Console logs everything specified in an array under a **logLevel** object.

There are 5 logLevels: **default**, **info**, **success**, **warning**, **error**.

**NOTE: There must be a logLevel otherwise it will not work.**

## Contributing

See CONTRIBUTING.md