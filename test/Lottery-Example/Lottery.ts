import hre from "hardhat";
import { Artifact } from "hardhat/types";
import { Signers } from "../../types";
import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/dist/src/signer-with-address";

import { Lottery } from "../../typechain/Lottery"
import { shouldBehaveLikeLottery } from "./Lottery.behavior";

const { deployContract } = hre.waffle;

/*
describe("Lottery Contract Interaction Example", function () {        
    before(async function () {
        this.signers = {} as Signers;
        const signers: SignerWithAddress[] = await hre.ethers.getSigners();
        this.signers.admin = signers[0];
        this.gamblers = [] as Signers[];
        for (let i = 1; i <= (signers.length - 1); i++) {
            const gambler: SignerWithAddress = signers[i];
            this.gamblers.push(gambler);
        }
    });

    describe("Creating Lottery Contract", function () {
        before(async function () {            
            const lotteryArtifact: Artifact = await hre.artifacts.readArtifact("Lottery");
            this.lottery = <Lottery>await deployContract(this.signers.admin, lotteryArtifact, []);
        });

        shouldBehaveLikeLottery();
    });
});
*/
