const command = {
  name: 'git-menu-cli',
  run: async toolbox => {
    await toolbox.menu.showMenu('',{ showHelp: false, headline: 'Selecione o comando a ser executado' });
  }
}

module.exports = command
