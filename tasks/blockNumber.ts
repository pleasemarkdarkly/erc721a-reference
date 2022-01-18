import "@nomiclabs/hardhat-ethers";
import { task } from "hardhat/config";

task("blockNumber", "Prints the current block number",
    async (_, hre) => {
        await hre.ethers.provider.getBlockNumber().then((blockNumber: number) => {
            console.log("Current block number: " + blockNumber);
        });
    }
);


