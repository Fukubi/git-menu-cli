const { filesystem } = require("gluegun");

module.exports = {
    name: "git-commit",
    alias: 'g-c',
    description: "Insere um commit no diretório Git",
    hidden: true,
    run: async toolbox => {
        const { print: { info, spin }, prompt, system, filesystem } = toolbox

        let configuration

        info('Iniciando commit do repositório');
        info('')

        if (await filesystem.exists('configuration/config.json') !== "file") {

            await filesystem.file('configuration/config.json', { mode: '777', content: '{"whantSave": null}' })
            configuration = await filesystem.read('configuration/config.json', "json")

            if (configuration.whantsave == null) {
                const askSave = { type: 'select', name: 'save', message: 'Deseja salvar o email em um arquivo? (Pode ser alterado no arquivo configuration/config.json)', choices: ['Não', 'Sim'] }
                const { save } = await prompt.ask(askSave);

                if (save === 'Sim') {
                    info('')

                    const spinnerConfig = spin('Criando arquivo de configuração')
                    await filesystem.file('configuration/temp/config.json', { mode: '777', content: '{"whantSave": true, "email": null, "usuario": null}' })
                    await filesystem.move('configuration/temp/config.json', 'configuration/config.json', { overwrite: true })

                    configuration = await filesystem.read('configuration/config.json', "json")

                    await filesystem.remove('configuration/temp')

                    spinnerConfig.succeed('Arquivo de configuração criado com sucesso');

                    info('')

                    if (configuration.whantSave) {
                        if (!configuration.email) {
                            const askMail = { type: 'input', name: 'email', message: 'Digite o seu e-mail do git (Ele é armazenado no arquivo configuration/config.json)' }
                            var { email } = await prompt.ask(askMail)
                            

                            info('')
                            const spinnerConfigEmail = spin('Inserindo email no arquivo de configuração');
                            await filesystem.file('configuration/temp/config.json', { mode: '777', content: `{"whantSave": true, "email": "${email}", "usuario": null}` })
                            await filesystem.move('configuration/temp/config.json', 'configuration/config.json', { overwrite: true })

                            configuration = await filesystem.read('configuration/config.json', 'json')

                            await filesystem.remove('configuration/temp')
                            spinnerConfigEmail.succeed('Email inserido no arquivo de configuração');
                            info('')
                        }

                        if (!configuration.usuario) {

                            const askUsuarioConfig = { type: 'select', name: 'whantUsuario', message: 'Deseja salvar o usuário no arquivo de configuração?', choices: ['Não', 'Sim'] }
                            const { whantUsuario } = await prompt.ask(askUsuarioConfig);
                            info('')

                            if (whantUsuario === 'Sim') {
                                const askUsuarioName = { type: 'input', name: 'usuario', message: 'Digite o seu usuário (Ele é armazenado no arquivo configuration/config.json)' }
                                const { usuario } = await prompt.ask(askUsuarioName);

                                info('')
                                const spinnerConfigUsuario = spin('Inserindo usuário no arquivo de configuração')
                                await filesystem.file('configuration/temp/config.json', { mode: '777', content: `{"whantSave": true, "email": "${email}", "usuario": "${usuario}"}` })
                                await filesystem.move('configuration/temp/config.json', 'configuration/config.json', { overwrite: true })

                                configuration = await filesystem.read('configuration/config.json', 'json')

                                await filesystem.remove('configuration/temp')
                                spinnerConfigUsuario.succeed('Usuário inserido no arquivo de configuração');
                                info('')
                            }
                        }
                    }
                } else {
                    await filesystem.file('configuration/temp/config.json', { mode: '777', content: '{"whantSave": false}' })
                    await filesystem.move('configuration/temp/config.json', 'configuration/config.json', { overwrite: true })

                    configuration = await filesystem.read('configuration/config.json', "json")

                    await filesystem.remove('configuration/temp')
                }
            }

        } else {
            configuration = await filesystem.read('configuration/config.json', "json")
        }

        const askMessage = { type: 'input', name: 'message', message: 'Digite o texto do commit' }
        const { message } = await prompt.ask(askMessage)
        info('')

        const spinnerCommit = spin('Executando commit')
        await system.run('git add .', { trim: true })
        await system.run(`git config user.email "${configuration.email}"`)
        if (configuration.usuario) {
            await system.run(`git config user.name "${configuration.usuario}"`)
        }
        await system.run(`git commit -m "${message}"`);
        spinnerCommit.succeed('Commit inserido com sucesso')

    }
}