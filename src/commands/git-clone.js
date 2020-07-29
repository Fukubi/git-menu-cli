module.exports = {
    name: "git-clone",
    alias: 'g-cl',
    description: "Clona um repositório git",
    hidden: true,
    run: async toolbox => {
        const { print: { info, spin }, prompt, system } = toolbox

        const askLink = { type: 'input', name: 'link', message: 'Digite a URL do repositório a ser clonado:' }
        const { link } = await prompt.ask(askLink);
        info('')

        const spinner = spin('Clonando repositório')
        try {
            await system.run(`git clone ${link}`)
            spinner.succeed('Repositório clonado com sucesso')
        } catch (err) {
            spinner.fail(`Falha ao clonar o repositório: ${err}`);
        }
        
    }
}