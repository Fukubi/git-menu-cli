module.exports = {
    name: 'git-init',
    alias: 'g-i',
    description: 'Inicia um repositório git',
    hidden: true,
    run: async toolbox => {
        const { print: { info, spin }, prompt, template, system, foo } = toolbox

        info('Iniciando o git nesse diretório');
        spinnerInit = spin('Inicializando diretório git');
        try {

            await system.run('git init', { trim: true })

            spinnerInit.succeed('Repositório inicializado com sucesso');
        } catch {
            spinnerInit.fail('Não foi possível inicializar o repositório');
        }

        const askReadme = { type: 'input', name: 'readme', message: 'Deseja criar o arquivo readme.md? (S/n)' }

        const { readme } = await prompt.ask(askReadme)

        if (readme === 'S' || readme === 's') {
            const askTexto = { type: 'input', name: 'texto', message: 'Digite algo para inserir no readme.md(Caso não queira, apenas deixe em branco)' }

            const { texto } = await prompt.ask(askTexto)

            const spinnerReadme = spin('Criando readme.md')

            try {

                await template.generate({
                    template: 'readme.md.ejs',
                    target: 'readme.md',
                    props: { texto }
                })

                spinnerReadme.succeed('readme.md criado com sucesso');

                const askIgnore = { type: 'input', name: 'ignore', message: 'Deseja criar o arquivo .gitignore? (S/n)' }
                const { ignore } = await prompt.ask(askIgnore)

                if (ignore === 'S' || ignore === 's') {

                    const askTextoIgnore = { type: 'input', name: 'textoIgnore', message: 'Digite o texto do git ignore(Caso não seja inserido nada, será criado um arquivo vazio):' }
                    const { textoIgnore } = await prompt.ask(askTextoIgnore)

                    const spinnerIgnore = spin('Criando arquivo .gitignore')

                    try {

                        await template.generate({
                            template: '.gitignore.ejs',
                            target: '.gitignore',
                            props: { textoIgnore }
                        })

                        spinnerIgnore.succeed('.gitignore criado com sucesso')



                    } catch {
                        spinnerIgnore.fail('Não foi possível criar o .gitignore')
                        return
                    }

                } else {
                    info('.gitignore não criado')
                    return
                }

            } catch {
                spinnerReadme.fail('Não foi possível criar o readme.md')
                return
            }


        } else {
            info('Não criar README')
            return
        }

    }
}