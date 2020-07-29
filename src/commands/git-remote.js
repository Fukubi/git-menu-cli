module.exports = {
    name: "git-remote",
    alias: 'g-r',
    description: "Adicionar uma variável remote para o git",
    hidden: true,
    run: async toolbox => {
        const { print: { info, error, spin }, prompt, system } = toolbox

        info('')
        const askName = { type: 'input', name: 'name', message: "Digite o nome da váriavel a ser adicionada" }
        const { name } = await prompt.ask(askName)
        info('')

        const askValue = { type: 'input', name: 'value', message: "Digite o valor da váriavel a ser adicionada" }
        const { value } = await prompt.ask(askValue)
        info('')

        const spinner = await spin("Adicionando variável ao ambiente")
        info('')

        try {
            await system.run(`git remote add ${name} ${value}`)

            spinner.succeed(`Variável ${name} adicionada com sucesso`)
        } catch (err) {
            const {stderr} = err
            info('')
            error(stderr)
        }
    }
}