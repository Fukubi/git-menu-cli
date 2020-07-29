module.exports = {
    name: 'git-pull',
    alias: 'g-pull',
    description: "Atualiza os arquivos da pasta que está trabalhando",
    hidden: true,
    run: async toolbox => {
        const { print: { info, error, spin }, system, prompt } = toolbox

        const remote = await system.run('git remote')

        let escolhas = remote.split('\n')

        escolhas.pop()
        escolhas.push('Inserir URL')

        const askVar = { type: 'select', name: 'variavel', message: "Escolha a variável do ambiente ou digite a url", choices: escolhas }
        const { variavel } = await prompt.ask(askVar)
        info('')

        if (variavel === 'Inserir URL') {
            try {
                const askURL = { type: 'input', name: 'url', message: 'Digite a URL do repositório a se enviar as alterações' }
                const { url } = await prompt.ask(askURL)
                info('')

                const branchs = await system.run('git branch')

                let escolhas = branchs.split('\n')

                escolhas.pop()
                escolhas.push('Inserir branch')

                const askBranch = { type: 'select', name: 'branch', message: "Escolha a branch a se enviar as alterações", choices: escolhas }
                const { branch } = await prompt.ask(askBranch)
                info('')

                if (branch === 'Inserir branch') {

                    const askBranchInput = { type: 'input', name: 'branchName', message: 'Digite a branch a se enviar as alterações' }
                    const { branchName } = await prompt.ask(askBranchInput)
                    info('')

                    const spineerUrl = await spin('Atualizando projeto')
                    await system.run(`git push ${url} ${branchName}`)
                    spineerUrl.succeed('Projeto atualizado com sucesso')

                    return

                } else {
                    const spineerUrl = await spin('Atualizando projeto')
                    await system.run(`git push ${url} ${branch}`)
                    spineerUrl.succeed('Projeto atualizado com sucesso')

                    return
                }

            } catch (err) {
                const { stderr } = err

                error(stderr)
            }

        } else {
            try {
                const branchs = await system.run('git branch')

                let escolhas = branchs.split('\n')

                escolhas.pop()
                escolhas.push('Inserir branch')

                const askBranch = { type: 'select', name: 'branch', message: "Escolha a branch a se enviar as alterações", choices: escolhas }
                const { branch } = await prompt.ask(askBranch)
                info('')

                if (branch === 'Inserir branch') {

                    const askBranchInput = { type: 'input', name: 'branchName', message: 'Digite a branch a se enviar as alterações' }
                    const { branchName } = await prompt.ask(askBranchInput)
                    info('')

                    const spineerUrl = await spin('Atualizando projeto')
                    await system.run(`git push ${variavel} ${branchName}`)
                    spineerUrl.succeed('Projeto atualizado com sucesso')

                    return

                } else {
                    const spineerUrl = await spin('Atualizando projeto')
                    await system.run(`git push ${variavel} ${branch}`)
                    spineerUrl.succeed('Projeto atualizado com sucesso')

                    return
                }

            } catch (err) {
                const { stderr } = err

                error(stderr)
            }
        }
    }
}