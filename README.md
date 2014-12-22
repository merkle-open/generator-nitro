sentinel
========

sentinel is watching your frontend

## Should I check in dependencies?

[What npm says](https://www.npmjs.org/doc/misc/npm-faq.html#should-i-check-my-node_modules-folder-into-git-):
Usually, no. Allow npm to resolve dependencies for your packages.

For packages you deploy, such as websites and apps, you should use npm shrinkwrap to lock down your full dependency 
tree.

**Don't checkin node_modules and use npm-shrinkwrap for deployments.**

[What bower says](http://addyosmani.com/blog/checking-in-front-end-dependencies/):
If you aren’t authoring a package that is intended to be consumed by others (e.g., you’re building a web app), you 
should always check installed packages into source control.

Therefore node_modules **is** ignored, bower_components (well in this case assets/vendor) **is not**.