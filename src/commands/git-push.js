module.exports = {
    name: "git-push",
    alias: 'g-p',
    description: 'Envia as alterações para o repositório',
    hidden: true,
    run: async toolbox => {
        const { print: { info, error, spin }, system, prompt } = toolbox

        const remote = await system.run('git remote')

        let escolhas = remote.split('\n')
        info(escolhas)

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
                info(escolhas)

                escolhas.pop()
                escolhas.push('Inserir branch')

                const askBranch = { type: 'select', name: 'branch', message: "Escolha a branch a se enviar as alterações", choices: escolhas }
                const { branch } = await prompt.ask(askBranch)
                info('')

                if (branch === 'Inserir branch') {

                    const askBranchInput = { type: 'input', name: 'branchName', message: 'Digite a branch a se enviar as alterações' }
                    const { branchName } = await prompt.ask(askBranchInput)
                    info('')

                    const spineerUrl = await spin('Enviando alterações para o repositório')
                    await system.run(`git push ${url} ${branchName}`)
                    spineerUrl.succeed('Alterações enviadas com sucesso')

                    return

                } else {
                    const spineerUrl = await spin('Enviando alterações para o repositório')
                    await system.run(`git push ${url} ${branch}`)
                    spineerUrl.succeed('Alterações enviadas com sucesso')

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
                info(escolhas)

                escolhas.pop()
                escolhas.push('Inserir branch')

                const askBranch = { type: 'select', name: 'branch', message: "Escolha a branch a se enviar as alterações", choices: escolhas }
                const { branch } = await prompt.ask(askBranch)
                info('')

                if (branch === 'Inserir branch') {

                    const askBranchInput = { type: 'input', name: 'branchName', message: 'Digite a branch a se enviar as alterações' }
                    const { branchName } = await prompt.ask(askBranchInput)
                    info('')

                    const spineerUrl = await spin('Enviando alterações para o repositório')
                    await system.run(`git push ${variavel} ${branchName}`)
                    spineerUrl.succeed('Alterações enviadas com sucesso')

                    return

                } else {
                    const spineerPush = await spin('Enviando alterações para o repositório')
                    await system.run(`git push ${variavel} ${branch}`)
                    spineerPush.succeed('Alterações enviadas com sucesso')

                    return
                }


            } catch (err) {
                const { stderr } = err

                error(stderr)
            }

        }
    }
}   