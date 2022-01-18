import hre from "hardhat";
import { Artifact } from "hardhat/types";
import { Signers } from "../types";
import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/dist/src/signer-with-address";

import { Azuki } from "../typechain/Azuki"
import { shouldBehaveLikeAzuki } from "./Azuki.behavior";

const { deployContract } = hre.waffle;

describe("Setup Admin and Unnamed Accounts", function () {
    before(async function () {
        this.signers = {} as Signers;
        const signers: SignerWithAddress[] = await hre.ethers.getSigners();
        this.signers.admin = signers[0];
        this.unnamedAccounts = [] as Signers[];
        for (let i = 1; i <= (signers.length - 1); i++) {
            const unnamedAccount: SignerWithAddress = signers[i];
            this.unnamedAccounts.push(unnamedAccount);
        }
    });

    describe("Creating Azuki Artifacts", function () {
        before(async function () {
            const AzukiArtifact: Artifact = await hre.artifacts.readArtifact("Azuki");
            this.Azuki = <Azuki> await deployContract(this.signers.admin, AzukiArtifact, [ 100, 1250, 1025, 25]);
        });

        shouldBehaveLikeAzuki();
    });
});
