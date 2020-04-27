const fs = require('fs');
var inquirer = require('inquirer');
const { spawn } = require('child_process');
const bip39 = require('bip39');

writeFile = (filename, data) => {
    fs.writeFile(filename, new Uint8Array(Buffer.from(data)), (err) => {
        if (err) throw err;
    });
}
validateMnemonic = (mnemonic) => {
    if (mnemonic !== '') {
        if (lngDetector(mnemonic)) {
            return bip39.validateMnemonic(mnemonic, bip39.wordlists.EN)
        } else {
            return bip39.validateMnemonic(mnemonic.replace(/ /g, '').split('').join(' '), bip39.wordlists.chinese_simplified)
        }
    } else {
        return false
    }
}
lngDetector = (word) => {
    var regex = new RegExp('^([a-z]{0,200})$')
    return regex.test(word.replace(/ /g, ''))
}
main = async () => {
    inquirer.prompt([
        {
            type: 'list',
            name: 'network',
            message: '选择网络 :',
            choices: [
                {
                    name: "ganache cli 测试环境",
                    value: "ganache"
                },
                {
                    name: "truffle 测试环境",
                    value: "develop"
                },
                {
                    name: "Ropsten 测试网",
                    value: "ropsten"
                },
                {
                    name: "Rinkeby 测试网",
                    value: "rinkeby"
                },
                {
                    name: "Kovan 测试网",
                    value: "kovan"
                },
                {
                    name: "以太坊主网",
                    value: "mainnet"
                },
            ],
        },
        {
            type: 'input',
            name: 'mnemonic',
            message: '输入助记词打开钱包 :',
            when: (answers) => {
                return answers.network === "ropsten" ||
                    answers.network === "rinkeby" ||
                    answers.network === "kovan" ||
                    answers.network === "mainnet";
            },
            validate: (value) => {
                var pass = validateMnemonic(value);
                if (pass) {
                    return true;
                }
                return '助记词不正确!';
            }
        },
        {
            type: 'input',
            name: 'infura',
            message: '输入 Infura Key,可以在这里申请:https://infura.io/ :',
            when: function (answers) {
                return answers.mnemonic;
            }
        }
    ])
        .then(answers => {
            if (answers.network === "ganache") {
                console.log("\033[33mRun:\033[39m " + "ganache-cli -e 1000");
                argv = ["-e", "1000"];
                spawn('ganache-cli', argv, {
                    stdio: 'inherit',
                    shell: true
                });
            } else if (answers.network === "develop") {
                console.log("\033[33mRun:\033[39m " + "truffle develop");
                argv = ['develop'];
                spawn('truffle', argv, {
                    stdio: 'inherit',
                    shell: true
                });
            } else {
                writeFile('.mnemonic', answers.mnemonic);
                writeFile('.infuraKey', answers.infura);
                console.log("\033[33mRun:\033[39m " + "truffle console --network " + answers.network);
                argv = ["console", "--network", answers.network];
                spawn('truffle', argv, {
                    stdio: 'inherit',
                    shell: true
                });
            }
        });
}

main();