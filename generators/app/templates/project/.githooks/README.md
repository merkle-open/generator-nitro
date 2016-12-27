# Project Git Hooks

Git hooks in this directory will be installed with:

    gulp sync-githooks

This command is executed on every npm install.  
Every file in this directory will be installed in the git hooks directory (`.git/hooks/`) if:

* the git hooks directory exists
* the filename is a valid hook name
* there is not an existing user hook (hooks installed with this script will be replaced with the current version)

Removing a git hook from this directory will uninstall the corresponding git hook with the next `gulp sync-githooks`.

## hook names

    applypatch-msg
    commit-msg
    post-applypatch
    post-checkout
    post-commit
    post-merge
    post-receive
    pre-applypatch
    pre-auto-gc
    pre-commit
    pre-push
    pre-rebase
    pre-receive
    prepare-commit-msg
    update
