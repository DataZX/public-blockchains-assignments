// Ethers JS: Quiz Contract.
////////////////////////////

// Note: this script includes reading from command-line and it might not
// work well with Code Runner. Please run inside a terminal.

// Load dependencies.
/////////////////////

const path = require("path");

const ethers = require("ethers");

// Adjust path to your .env file.
const pathToDotEnv = path.join(__dirname, "..", "..", ".env");
// console.log(pathToDotEnv);
require("dotenv").config({ path: pathToDotEnv });

const { getUserAnswer, extractQuestion } =
    require(path.join(__dirname, "quiz_helper.js"));

// Create Signer and Contract.
//////////////////////////////

const providerKey = process.env.ALCHEMY_KEY;
const sepoliaUrl = `${process.env.ALCHEMY_SEPOLIA_API_URL}${providerKey}`;
// console.log(sepoliaUrl);
const sepoliaProvider = new ethers.JsonRpcProvider("http://134.155.50.136:8506/");

const signer = new ethers.Wallet(
    process.env.METAMASK_1_PRIVATE_KEY,
    sepoliaProvider
);

const quizABI = require(path.join(__dirname, "quiz_abi"));

// The address of the Quiz contract.
const contractAddress = "0x01C95f8938f57F090Bf2c1CBC541c3CB49e8Dff0";

const quizContract = new ethers.Contract(contractAddress, quizABI, signer);

async function main() {
    try {
        // A. Ask question and get a transaction receipt.
        const question = await quizContract.askQuestion();
        const receipt = await question.wait();

        // Extract question text from the receipt.
        const { text, storedAnswer } = extractQuestion(quizContract, receipt); // Trim the question text

        console.log(text);

        // Now YOU answer the question!
        const userAnswer = await getUserAnswer();

        // B. Send the answer to the smart contract.
        const answer = await quizContract.answerQuestion(text, userAnswer);
        answer.wait();

        // C. Verify the stored answer.
        console.log(`Stored answer for question "${text}": ${storedAnswer ? 'Yes' : 'No'}`);
    } catch (error) {path.normalize
        console.error('Error:', error);
    }
}
main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exit(1);
    });
