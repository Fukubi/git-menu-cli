module.exports = {
    name: 'git-remote-remove',
    alias: 'g-r-r',
    description: 'Remove uma variável adicionada',
    hidden: true,
    run: async toolbox => {
        const { print: { info, spin, error }, system, prompt } = toolbox

        const remote = await system.run('git remote')

        let escolhas = remote.split('\n')
        info(escolhas)

        escolhas.pop()

        const askVar = { type: 'select', name: 'variavel', message: "Escolha a variável do ambiente ou digite a url", choices: escolhas }
        const { variavel } = await prompt.ask(askVar)
        info('')

        const spineerRemove = await spin('Removendo variável')
        await system.run(`git remote remove ${variavel}`)
        spineerRemove.succeed('Variável removida')
        info('')
    }
}