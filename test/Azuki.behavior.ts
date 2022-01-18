/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import hre from "hardhat";
import { expect } from "chai";
import { BigNumber } from "ethers";
import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/dist/src/signer-with-address";

// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
export const keys = async (obj: any) => {
    Object.keys(obj).toString().split(`,`).forEach(p => { process.stdout.write(`${p}` + `\n`); })
}

export function shouldBehaveLikeAzuki(): void {
    it("should return ex contract constructor initial state", async function () {
        const AzukiAddress = await this.Azuki.address;
        const AzukiBalance = await hre.ethers.provider.getBalance(AzukiAddress);
        process.stdout.write(`deployed contract to => ` +
            `${await this.Azuki.address}:${AzukiBalance} (wei)` + `\n`);        
        expect(await this.Azuki.address);
        expect(AzukiBalance).to.equal(0);        
    });

    it("should display other unnamed addresses and balances", async function () {        
        const ad: SignerWithAddress = this.signers.admin;
        process.stdout.write(`(+)` + `\t` + `${await ad.address}:${await ad.getBalance()}` + `\n`);
        for (let i = 0; i < this.unnamedAccounts.length; i++) {
            const a: SignerWithAddress = this.unnamedAccounts[i];
            process.stdout.write(`(${i})` + `\t` + `${await a.address}:${await a.getBalance()}` + `\n`);
        }
        process.stdout.write(`🎉🎉🎉 Let's test stuff` + `\n`);
    });

    it("should display contract keys", async function () {
        await keys(this.Azuki);
    });

    it("should print something", async function () {
        /*
        const author: string = await this.ex.author();        
        process.stdout.write(`author:${author}` + `\n`);
        */
        process.stdout.write(`something` + `\n`);
    });
};
