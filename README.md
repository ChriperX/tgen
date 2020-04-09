# tgen

![](https://github.com/ChriperX/tgen/blob/master/media/tgen-demo.gif)

## Legend
 - [Install](#install)
    - [npm](#npm)
    - [yarn](#yarn)
 - [FAQ](#faq)
    - [What's tgen?](#what's-tgen)
    - [What do i need to install tgen?](#what-do-i-need-to-install-tgen)
    - [What do i need to create plugins?](#what-do-i-need-to-create-plugins)
    - [Ok how do i create my first project with tgen?](#ok-how-do-i-create-my-first-project-with-tgen)
    - [Compatibility](#compatibility)
 - [Documentation](#documentation)
    - [CLI Commands](#cli-commands)
      - [`start`](#start-template-projname)
      - [`new`](#new-template-projname)
      - [`exec`](#exec-template-projname)
      - [`verbose` and `suppress`](#verbose-and-suppress)
      - [`plugin`](#plugin-option-pluginname)
      - [`use`](#use-loadername-newloader)
    - [Template formatting](#template-formatting)
    - [Common plugin syntax](#common-plugin-syntax)
    - [Parser plugins](#parser-plugins)
    - [Template plugins](#template-plugins)
    - [Loaders](#loaders)
    - [Variables](#variables)
        - [Variable syntax](#variable-syntax)
        - [Creating a variable](#creating-a-variable)
        - [Read from a variable](#read-from-a-variable)
        - [Add variable support to plugins](#add-variable-support-to-plugins)
    - [API](#api)
        - [Memory](#memory)
        - [Logger](#logger)
 - [Template keys syntax](#template-keys-syntax)
    - [use](#use)
    - [create](#create)
    - [commands](#commands)
    - [if](#if)
    - [else](#else)
    - [log](#else)
    - [prompt](#prompt)
    - [set](#set)
    - [write](#write)
 - [Contributing](#contributing)
 - [Donating](#donating)

## Install

### npm

```bash
npm i @nonamenpm/tgen -g

```

### yarn

```bash
yarn global add @nonamenpm/tgen

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

You can install templates directly with tgen, or drop them in **/cli/templates/**.

To create templates you need to know how [YAML](https://yaml.org) works, and what [keys](#template-keys-syntax) are and how to use them.

### Compatibility

TGen has been tested and works in the following environments:  
- Windows (x64)
- Ubuntu (x64)
- macOs (x64)  

With node version: > 10.16.0.

### Ok how do i create my first project with tgen?

```bash
tgen new yourLanguageHere yourProjectNameHere

```

This will execute the template **yourLanguageHere** (you can see what templates you have installed in /cli/templates/), creating a
project called **yourProjectNameHere**.

## Documentation

### CLI Commands

#### `start <template> <projName>`

Creates a project called `projName` from template `template`.

#### `new <template> <projName>`

Alias of start.

#### `exec <template> <projName>`

Alias of start.

#### `verbose` and `suppress`

Enables verbose logging or suppresses:

- info;
- default;
- success logs.

#### `plugin <option> <pluginName>`

Performs an action on `pluginName`.  
Available actions are:

- info: displays info of `pluginName`;
- ignore: when loading a template it ignores a list of plugins;
- check: displays installed plugins given plugin directory name.

#### `use <loaderName> <newLoader>`

Uses a custom loader `newLoader` for `loaderName`.  
Available loader types are:

- templateKeysLoader;
- templateLoader;
- commandLoader.

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
  default:
    - i am logging to the console with the log template key!

```

**NOTE: When writing a plugin, please add a pluginInfo object to your plugin. It's optional, but it's recommended.**

**NOTE: The log plugin is already installed by default. Installed template plugins will be listed whenever a new project is created.**

### Loaders

Loaders are "plugins" that perform loading/parsing operations, that can be customized. They can be found in /loaders/

#### templateLoader

The templateLoader defines what loader to use for templates. 

#### commandLoader

The commandLoader defines what loader to use to load commands for the cli.

#### templateKeysLoader

The templateKeysLoader defines what loader to use for templateKeys plugins.

### Common Loader Syntax

A loader is a simple .js file that includes a function exported with `module.exports`.  
The function takes 3 aruments, in the case of `pluginLoader`s, and 2 arguments in the case of `templateLoader`s and `commandLoader`s:  
- `load`: function that passes necessary arguments to tgen
- `objTree`: (exclusive to `pluginLoader`s) used to check for the `use` keyword in a template.
- `fileName` | `dir`: used for loading `fileName` or scanning `dir`  

#### `load`

In `commandLoader`s and `templateLoader`s, `load` takes 1 argument:  
the imported plugin (`commandLoader`) or the parsed template file (`templateLoader`).

**NOTE: `load()` takes 2 arguments in `pluginLoader`s, the imported plugins and the list of plugins.**

#### Example

```js
/* @flow */

//This file is a modified version of the default templateLoader
//instead of loading .yaml files, it loads .json files

//create the custom loader function
module.exports = function(load: Function, fileName: string): ?number {
	const fs = require('fs');
	const chalk = require('chalk');
	const error = require('../cli/messages').newMessageType('error');
	const logger = require('../cli/utils/logger');

	try {
		//load file, TGENPATH is the path to where tgen is installed
		// $FlowFixMe
		var extension = fs.existsSync(process.env.TGENPATH + '../templates/' + fileName + '.json') ? '.json' : '.jsonc';
		var file = JSON.parse(
			// $FlowFixMe
			fs.readFileSync(process.env.TGENPATH + '../templates/' + fileName + extension, 'utf8')
		); //parse the yaml template
	} catch (e) {

    //template not found
    fileName !== undefined
      ? logger(
          error(chalk.redBright('error: template not found: '), 'template_not_found') +
            chalk.whiteBright(fileName),
          'error'
        )
      : logger(error('error: please specify a template.', 'template_not_specified'), 'error');
  
		return 1;
	}
	load(file);
};


```

### Variables

#### Variable Syntax

Variables can't contain a space in between the var name, or any alphanumerical character ($, %, -, ., etc...), but variables can start and end with spaces.

Example of a valid variable:

```yaml
log:
  info:
    - 'Hello ${{name}}!'

```

#### Creating a variable

You can create and assign a value to a variable using the set key (see [set](#set)).

#### Read from a variable

You can reference a variable by writing ${{var_name_here}}

#### Add variable support to plugins

See [API](#api)

### API

#### Memory

The memory is handled by **mem.js** (you can find it in **cli/utils/**).

It loads the **.tgen.yaml** config file, and handles variables.

To create a variable with mem.js, you have to call the **newVar()** function.

It takes as arguments the content of the variable, and the name.

To replace all the variables references in a string, call the **replaceVars()** function.

It takes as an argument the string, and returns the resolved string.

#### logger

Logger is a module that logs to the console with proper formatting.

**Example**:

```js
//require the logger module, located in cli/utils/logger.js
const logger = require('../../cli/utils/logger.js')

//logger takes as an argument a string, and a logLevel.
//logLevels are identical to the log plugin logLevels
logger('This is a string formatted properly for tgen.', 'default')

```

## Template keys syntax

### use

If present in the template, loads all plugins specified.

If it's not present, it will load all plugins installed.

**Example**:

```yaml
use:
  - 'log'
# in this case, tgen is going to load only the log plugin.
```

**NOTE: The use key can load plugins that are ignored in .tgen.yaml**

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

See the [examples](/tree/master/examples)

### log

Console logs everything specified in an array under a **logLevel** object.

There are 5 logLevels: **default**, **info**, **success**, **warning**, **error**.

**NOTE: There must be a logLevel otherwise it will not work.**

### prompt

Takes user input with a prompt specified, and stores it in a variable specified in the custom prompt object.

```yaml
prompt:
  "What's your name?":
    'user_name'
log:
  default:
    - Hi $(user_name)!
```

### set

Creates a variable, whose name is specified as an object, and the value is specified under the variable name.

```yaml
set:
  greetings:
    'Hi!'
log:
  default:
    - $(greetings)
```

### write

Writes to a file specified under the write object.

```yaml
write:
  'lorem.txt': |
    Lorem ipsum
        dolor
    sit amet.
```

## Contributing

See CONTRIBUTING.md

## Donating

If you want to donate you can with cryptos!

### Ethereum

```
0x72A8Db5952110Bc06425099945F18F9A7d268560
```

### Bitcoin Cash

```
qpluevlrmtt6eqg9qh604zp80hkc3p764sulqtqd8x
```

### ZCash

```
t1e58RCguse2tYw1bAT6ZZZpgPduim6tLAz
```