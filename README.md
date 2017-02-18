# insidious-bird

## Description

Use a Flappy Bird Clone to make a networked game that includes simultaneous multiplayer and saving a user's game data to a postresql database.

## Context

Learn the ins and outs of Networking and sharing simultaneous data between multiple users.

## Specifications

- [x] User can play a basic Flappy Bird clone using the Spacebar
- [ ] Map is generated randomly with a reusable seed, allowing multiple players to see the same random map.
- [ ] User can log in, and we will use a postresql database to save high scores, achievements, flap count
- [ ] Users will be able to connect to each other from different computers to play a head-to-head game.
- [ ] Game saves win loss record after versus games
- [ ] Database saves locations where players have died, and you can see the deaths of people you played a vs. match against.
- [ ] Test backend and testable front end functions with chai

## Stretch Goals
- [ ] Implement character movement without Phaser
- [ ] Implement random obstacle generation without Phaser
- [ ] Implement collision detection without Phaser

### Required

_Do not remove these specs - they are required for all goals_.

- [x] The artifact produced is properly licensed, preferably with the [MIT license][mit-license].

## Quality Rubric

**Well formatted code**
- Code uses a linter, which can be invoked with a command (e.g. `npm run lint`). [50 points]
- Running the linter on all source code files generates no linting errors. [50 points]

**Clear and useful README**
- Repository includes a README file with installation and setup instructions. [25 points]
- Repository includes a README file with usage instructions and at least one example use case. [25 points]

**Proper dependency management**
- There is a command to install dependencies (e.g. `npm install`) and it is specified in the installation and setup instructions of the README. [50 points]

**Good project management**
- Commit messages are concise and descriptive. [25 points]
- All features are added via pull requests. [25 points]
- Every pull request has a description summarizing the changes made. [25 points]
- Every pull request has been reviewed by at least one other person. [25 points]

---

<!-- LICENSE -->

<a rel="license" href="http://creativecommons.org/licenses/by-nc-sa/4.0/"><img alt="Creative Commons License" style="border-width:0" src="https://i.creativecommons.org/l/by-nc-sa/4.0/80x15.png" /></a>
<br />This work is licensed under a <a rel="license" href="http://creativecommons.org/licenses/by-nc-sa/4.0/">Creative Commons Attribution-NonCommercial-ShareAlike 4.0 International License</a>.

[mit-license]: https://opensource.org/licenses/MIT
