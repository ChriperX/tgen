# Contributing Guide

## How to contribute

### Setting up

1. Fork this repo.
2. Go to your fork.
3. Clone your fork `git clone https://github.com/YOUR_USERNAME/tgen.git`.
4. Navigate to the tgen directory `cd tgen`.

### Making changes

1. Create a new branch: `git checkout -b YOUR_BRANCH_NAME_HERE`
    
    **NOTE: if you are confused on what branches do and why you shouldn't directly change `master`, check [this](https://guides.github.com/introduction/flow/)**
2. Make your changes.
3. Push your changes to your branch `git push origin YOUR_BRANCH_NAME`
4. Go to your fork's GitHub repo, and you should see something like this: ![GitHub Pull Request](https://galaxyproject.github.io/training-material/topics/contributing/images/PR_button.png)
5. Click on `Compare & pull request`.
   
    **NOTE: When making a pull request please follow the [contributing rules](#contributing-rules).**
6. Make sure you see master on the left and your branch name on the right: ![GitHub Compare](https://galaxyproject.github.io/training-material/topics/contributing/images/PR_branch_check.png)
7. Fill in the pull request title and description.
8. Create pull request.

## File Structure

If you see the file structure, in the root there are two main folders:
    
    - src/
    - cli/
    - plugins/

Inside `src` there are two other directories:

    - cli/
    - plugins/

Inside `src/cli/` there is the source code for the cli (tgen), whereas `src/plugins/` is were the source code for the plugins is stored.

### What's the diffrence?

The source code for the cli and the plugins are built with [Flow](https://flow.org), and obviously the they need to be compiled, respectively the source code of the cli and the plugins end up in `cli/` and `plugins/`.

## Contributing rules.

Now that you know where to look at, there are some rules that you have to follow while contributing to tgen:

1. When adding a feature to a module or fixing an issue, please write tests. 

    **NOTE: Tests are stored in the `tests` folder, and written with mocha and chai.**

2. If you are creating a new file, write tests to `tests/file_name.test.js`

3. Make a pull request for a file, only if **all** tests pass.

    **NOTE: If a minor test isn't passing, just make sure everything else works as expected.**

4. When modifying or creating a file, please use **flow static type checking**.

5. If the changes have difficult-to-read code, please add comments.

6. When making a pull request, document the changes in the description.

## Useful npm scripts

- Run `npm run test` to run all the tests. It automatically builds all the files **and** runs the tests only if the build was sucessfull.

- Run `npm run build` to run the build script. It compiles files to the right directories.
- Use `npm run flow` to check the files with flow.
