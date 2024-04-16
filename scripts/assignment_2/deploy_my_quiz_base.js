const hre = require("hardhat");
const ethers = hre.ethers;

async function main() {

    // Input parameters for constructor.
    const questions = [
        "Is Ethereum a decentralized platform?",
        "Is a smart contract the same as a legal contract?",
        "Does Proof of Work involve solving complex mathematical problems?",
        "Is blockchain immutable?",
        "Can anyone view the details of a public blockchain transaction?",
    ];
    const answers = [true, false, true, true, true];

    // Deploy.
    const quiz = await ethers.deployContract("MyQuiz", [questions, answers]);
    
    // Print address.
    console.log(`Contract deployed at address ${quiz.target}`);

    // Wait for transaction to be mined.
    await quiz.waitForDeployment();

}

main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});




