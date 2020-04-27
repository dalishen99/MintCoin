const fs = require('fs');
var inquirer = require('inquirer');
const { spawn } = require('child_process');

const contractDir = 'migrations/';
getFiles = async (path) => {
    const dir = await fs.readdirSync(path, 'utf-8');
    let files = [{ name: '全部布署', value: 'all' }];
    dir.forEach((filename, index) => {

        const _filename = filename.split("_");
        const num = _filename[0];
        files[num] = { name: filename, value: num };
    })
    return files;
}
main = async () => {
    const files = await getFiles(contractDir);

    inquirer.prompt([
        {
            type: 'list',
            name: 'step1',
            message: '选择要布署的合约',
            choices: files,
        }
    ])
        .then(answers => {
            let argv;
            console.log(answers)
            if (answers.step1 !== 'all') {
                console.log("\033[33mRun:\033[39m " + "truffle migrate --f " + answers.step1 + " --to " + answers.step1);
                argv = ["migrate","--f", answers.step1,"--to",answers.step1];
            } else {
                argv = ["migrate","--reset"];
                console.log("\033[33mRun:\033[39m " + "truffle migrate ");
            }
            spawn("truffle", argv, {
                stdio: 'inherit',
                shell: true
            });

        });
}

main();