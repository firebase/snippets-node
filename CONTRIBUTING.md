# Contributing

We'd love for you to contribute to our source code and to make it even better than it is today! Here are the guidelines we'd like you to follow:

 - [Code of Conduct](#coc)
 - [Question or Problem?](#question)
 - [Issues and Bugs](#issue)
 - [Feature Requests](#feature)
 - [Submission Guidelines](#submit)
 - [Signing the CLA](#cla)

## <a name="coc"></a> Code of Conduct

As contributors and maintainers of the project, we pledge to respect everyone who contributes by posting issues, updating documentation, submitting pull requests, providing feedback in comments, and any other activities.

Communication through any of Firebase's channels (GitHub, StackOverflow, Google+, Twitter, etc.) must be constructive and never resort to personal attacks, trolling, public or private harassment, insults, or other unprofessional conduct.

We promise to extend courtesy and respect to everyone involved in this project regardless of gender, gender identity, sexual orientation, disability, age, race, ethnicity, religion, or level of experience. We expect anyone contributing to the project to do the same.

If any member of the community violates this code of conduct, the maintainers of the project may take action, removing issues, comments, and PRs or blocking accounts as deemed appropriate.

If you are subject to or witness unacceptable behavior, or have any other concerns, please drop us a line at samstern [at] google [dot] com.

## <a name="question"></a> Got a Question or Problem?

If you have questions about how to use the project, please direct these to [StackOverflow][stackoverflow] and use the `firebase` tag. We are also available on GitHub issues.

If you feel that we're missing an important bit of documentation, feel free to
file an issue so we can help. Here's an example to get you started:

```
What are you trying to do or find out more about?

Where have you looked?

Where did you expect to find this information?
```

## <a name="issue"></a> Found an Issue?

If you find a bug in the source code or a mistake in the documentation, you can help us by
submitting an issue on this repository. Even better you can submit a Pull Request
with a fix.

See [below](#submit) for some guidelines.

## <a name="submit"></a> Submission Guidelines

### Submitting an Issue

Before you submit your issue search the archive, maybe your question was already answered.

If your issue appears to be a bug, and hasn't been reported, open a new issue.
Help us to maximize the effort we can spend fixing issues and adding new
features, by not reporting duplicate issues.  Providing the following information will increase the
chances of your issue being dealt with quickly:

* **Overview of the Issue** - if an error is being thrown a non-minified stack trace helps
* **Motivation for or Use Case** - explain why this is a bug for you
* **Reproduce the Error** - provide a live example or an unambiguous set of steps.
* **Related Issues** - has a similar issue been reported before?
* **Suggest a Fix** - if you can't fix the bug yourself, perhaps you can point to what might be
  causing the problem (line of code or commit)

**If you get help, help others. Good karma rulez!**

### Submitting a Pull Request
Before you submit your pull request consider the following guidelines:

* Search for an open or closed Pull Request
  that relates to your submission. You don't want to duplicate effort.
* Please sign our [Contributor License Agreement (CLA)](#cla) before
  sending pull requests. We cannot accept code without this.
* Make your changes in a new git branch:

     ```shell
     git checkout -b my-fix-branch master
     ```

* Create your patch, **including appropriate test cases**.
* Commit your changes using a descriptive commit message.

     ```shell
     git commit -a
     ```
  Note: the optional commit `-a` command line option will automatically "add" and "rm" edited files.

* Push your branch to your fork on GitHub (make sure you already have a fork!):

    ```shell
    git push fork my-fix-branch
    ```

* In GitHub, send a pull request to `master`.

## <a name="cla"></a> Signing the CLA

Please sign our [Contributor License Agreement][google-cla] (CLA) before sending pull requests. For any code
changes to be accepted, the CLA must be signed. It's a quick process, we promise!

*This guide was inspired by the [AngularJS contribution guidelines](https://github.com/angular/angular.js/blob/master/CONTRIBUTING.md).*

[google-cla]: https://cla.developers.google.com
[style-guide]: http://google.github.io/styleguide/
[stackoverflow]: http://stackoverflow.com/questions/tagged/firebase
