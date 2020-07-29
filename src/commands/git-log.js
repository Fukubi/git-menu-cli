module.exports = {
    name: "git-log",
    alias: 'g-l',
    description: 'Mostra o log de um repositório',
    hidden: true,
    run: async toolbox => {
        const { print: { info, error, spin }, system } = toolbox

        info('')
        const spineer = spin('Lendo log do repositório')
        
        try {
            info('')
            await info(await system.run('git log'))
            spineer.succeed('Log lido com sucesso!')
            info('')

        } catch (err) {

            let {stderr} = err

            if (stderr === "fatal: your current branch 'master' does not have any commits yet\n") {
                error("Não existe nenhum commit na branch 'master', insira um commit")
                return
            }  

            if (stderr === "fatal: not a git repository (or any of the parent directories): .git\n") {
                error("Esta pasta não é um repositório Git, certifique-se que o git init já foi executado")
            }
        }

    }
}