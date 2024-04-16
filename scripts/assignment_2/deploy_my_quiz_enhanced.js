const hre = require("hardhat");
const ethers = hre.ethers;

async function main() {
    console.log('Deploying MyQuiz.sol\n');

    // Parameters for all deployment methods.

    // Define your questions and answers.
    const questions = [
        "Is Ethereum a decentralized platform?",
        "Is a smart contract the same as a legal contract?",
        "Does Proof of Work involve solving complex mathematical problems?",
        "Is blockchain immutable?",
        "Can anyone view the details of a public blockchain transaction?",
    ];

    const answers = [true, false, true, true, true];

    const path = require("path");

    // Option 1. Native Ethers.JS.
    //////////////////////////////
    console.log('Method 1: Native Ethers.js\n');

    // Load .env info.
    require("dotenv").config({ path: path.resolve(__dirname, ".env") });

    // Create provider.
    const notUniMaUrl = process.env.NOT_UNIMA_URL_1;
    const provider = new ethers.JsonRpcProvider(notUniMaUrl);

    // Create signer with attached provider.
    const signer = new ethers.Wallet(
        process.env.METAMASK_1_PRIVATE_KEY,
        provider
    );

    // Locate compilation outputs from Hardhat.
    const pathToCompiledContract = path.join(
        __dirname,
        "..",
        "artifacts",
        "contracts",
        "MyQuiz.sol",
        "MyQuiz.json"
    );
    const compContract = require(pathToCompiledContract);

    // Create a ContractFactory object.
    // https://docs.ethers.org/v6/api/contract/#ContractFactory
    const Quiz = await new ethers.ContractFactory(
        compContract.abi,
        compContract.bytecode,
        signer,
        // Provider can also be specified here, if not attached to signer.
        // provider
    );

    // Deploy contract.
    // https://docs.ethers.org/v6/api/contract/#ContractFactory-deploy
    const quiz = await Quiz.deploy(questions, answers);

    // Deploy creates the transaction, and you can get the contract address 
    // immediately; however, the transaction has been processed and 
    // included in a block yet. If you need to interact with the contract
    // immediately you need to wait for deployment.
    // console.log(await quiz.getQuestions()); // Will fail.
    await quiz.waitForDeployment();
    // console.log(await quiz.getQuestions()); // Will show answers.

    // Hardhat adds convenience methods to Ethers:
    // https://www.npmjs.com/package/@nomicfoundation/hardhat-ethers

    // Option 2. Mix Ethers.JS and Hardhat.
    ///////////////////////////////////////
    // console.log('Method 2: Hardhat + Ethers.js\n');

    // // Get a contract factory with default signer and provider
    // // as specified in hardhat.config.js.
    // const Quiz = await ethers.getContractFactory("MyQuiz");

    // // Note. If you need to specify a signer different from first one:
    // // const [ signer1, signer2 ]  = await ethers.getSigners();
    // // // Get a contract factory.
    // // const Quiz = await ethers.getContractFactory("MyQuiz", signer2);
    // // Check signer and provider.
    // // console.log("Signer address:   " + Quiz.runner.address);
    // // console.log("Provider network: " + Quiz.runner.provider._networkName);

    // // // Deploy with standard Ethers:
    // // // https://docs.ethers.org/v6/api/contract/#ContractFactory-deploy
    // const quiz = await Quiz.deploy(questions, answers);
    // await quiz.waitForDeployment();
    
    // // Option 4. Hardhat only.
    // //////////////////////////
    // console.log('Method 4: Hardhat only\n');

    // const quiz = await ethers.deployContract("MyQuiz", [questions, answers]);
    // await quiz.waitForDeployment();

    // // Option 5. Hardhat ignition.
    // //////////////////////////////
    // // It is a radically different way of deploying, you can learn more here:
    // // https://hardhat.org/hardhat-runner/docs/guides/deploying


    // Print address.
    console.log(`Contract deployed at address ${quiz.target}`);
}

main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});
