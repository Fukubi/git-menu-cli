const command = {
  name: 'git-menu-cli',
  run: async toolbox => {
    await toolbox.menu.showMenu('',{ showHelp: false });
  }
}

module.exports = command
