/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import hre from "hardhat";
import { expect } from "chai";
import { BigNumber } from "ethers";
import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/dist/src/signer-with-address";

const MAX_WAGER_AMOUNT = 1000000000000000;

// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
export const keys = async (obj: any) => {
    Object.keys(obj).toString().split(`,`).forEach(p => { process.stdout.write(`${p}` + `\n`); })
}

export const printPartyTxReceipt = async (receipt: any) => {
    process.stdout.write(
        `${receipt.from} => ${receipt.to} (gasUsed:${receipt.gasUsed})(${receipt.status})` + `\n` +
        `\ttx:${receipt.transactionHash} (block.no:${receipt.blockNumber})` + `\n`
    );
}

export const getRandomInt = (max: number): number => {
    return Math.floor(Math.random() * max);
}

export const getRandom = (): number => {
    let rando = Math.floor(Math.random() * MAX_WAGER_AMOUNT);
    if (rando === 0 || rando === undefined) rando = 987654321;
    return rando;
}

export function shouldBehaveLikeLottery(): void {    
    let lotteryAddress = '';
    let lotteryBalance: BigNumber;

    it("should return lottery contract constructor initial state", async function () {
        lotteryAddress = await this.lottery.address;
        lotteryBalance = await hre.ethers.provider.getBalance(lotteryAddress);                
        process.stdout.write(`deployed lottery contract to => ` +
        `${await this.lottery.address}:${lotteryBalance} (wei)` + `\n`);               
        process.stdout.write(`\n`);
        process.stdout.write(`number of players:${await this.lottery.numPlayers()}` + `\n`);
        process.stdout.write(`initial reward:${await this.lottery.reward()}` + `\n`);                        
        expect(await this.lottery.address);
        expect(lotteryBalance).to.equal(await this.lottery.reward());        
        expect(await this.lottery.numPlayers()).to.equal(0);
        process.stdout.write(`\n`);
    });

    it("should display initial players/gamblers addresses and balances", async function () {
        for (let i = 0; i < this.gamblers.length; i++) {
            const g: SignerWithAddress = this.gamblers[i];
            process.stdout.write(`${await g.address}:${await g.getBalance()}` + `\n`);
        }                
        process.stdout.write(`\n` + `🎉🎉🎉 Let's play the lottery` + `\n`);
    });

    it("should demonstrate players, balances, wagers and triggering lottery winners", async function () {
        for (let i = 0; i < this.gamblers.length; i++) {            
            const g: SignerWithAddress = this.gamblers[i];
            const wagerAmount = getRandom();
            process.stdout.write(
                `${await g.address}:` +
                `${await g.getBalance()}:` +
                `${await wagerAmount.toString()} (wei)` + `\n`);                       
            const tx = await this.lottery.connect(g).bet({ value: wagerAmount });
            const receipt = await tx.wait();
            // await keys(receipt);            
            const { to, from, gasUsed, transactionHash, blockNumber } = receipt;            
            process.stdout.write(`(${blockNumber})(${i}) ${from} ➡️  Lottery:${to}` + `\n` +
                `\t` + `🎰 bet:${wagerAmount} (⛽ ${gasUsed})` + `\n` +
                `\t` + `tx:${transactionHash}:${blockNumber}` + `\n`
            );           
        }

        lotteryBalance = await hre.ethers.provider.getBalance(lotteryAddress);
        const currentPlayers = await this.lottery.numPlayers();
        
        process.stdout.write(`lottery ${lotteryAddress} contract balance:${lotteryBalance}, ` +
            `reward:${await this.lottery.reward()}` + `\n` + 
            `remaining ${currentPlayers} is needed to test surprise rewards`);
                
        expect(currentPlayers).to.not.equal(0);
        expect(lotteryBalance).to.not.equal(0);
        process.stdout.write(`\n`);
    });

    it("should distribute random funds to users", async function () {
        const admin: SignerWithAddress = this.signers.admin;
        const adminBalance = await hre.ethers.provider.getBalance(await admin.address);
        const randomReward = getRandom(); // getRandomInt(100000000);

        process.stdout.write(`\n` + `💸 💸 💸 Rewarding users with ${randomReward}` + `\n`);
        process.stdout.write(
            `${await admin.address}:` +
            `${await adminBalance}:` +
            `${randomReward} (wei)` + `\n`);

        const tx = await this.lottery.connect(admin).rewardUsers({ value: randomReward });
        const receipt = await tx.wait();
        // await keys(receipt);            
        const { to, from, gasUsed, transactionHash, blockNumber } = receipt;
        process.stdout.write(`(${blockNumber}) ${from} ➡️  Lottery:${to}` + `\n` +
            `\t` + `random reward:${randomReward} (⛽ ${gasUsed})` + `\n` +
            `\t` + `tx:${transactionHash}:${blockNumber}` + `\n`
        );
    });

    it("should reset lottery to start state", async function () {
        const maxPlayers = await this.lottery.maxPlayers();        
        let currentPlayers = await this.lottery.numPlayers();
        let finalRounds = (maxPlayers - currentPlayers);
        lotteryBalance = await hre.ethers.provider.getBalance(lotteryAddress);
        
        if (currentPlayers || lotteryBalance) {
            process.stdout.write(`\n` +
                `💸 ${currentPlayers} active players,` +
                `${finalRounds} round(s) for the remaining balance of ${lotteryBalance}` + `\n`);            
        }
        
        while (finalRounds && currentPlayers !== 0) {   
            const g: SignerWithAddress = this.gamblers[finalRounds];
            const wagerAmount = 100000; // getRandomBigNumber();
            process.stdout.write(
                `${await g.address}:` +
                `${await g.getBalance()}:` +
                `${await wagerAmount.toString()} (wei)` + `\n`);
            const tx = await this.lottery.connect(g).bet({ value: wagerAmount });
            const receipt = await tx.wait();
            // await keys(receipt);            
            const { to, from, gasUsed, transactionHash, blockNumber } = receipt;
            process.stdout.write(`(${blockNumber}) (${finalRounds})${from} ➡️  Lottery:${to}` + `\n` +
                `\t` + `🎰 bet:${wagerAmount} (⛽ ${gasUsed})` + `\n` +
                `\t` + `tx:${transactionHash}:${blockNumber}` + `\n`
            );
            currentPlayers = await this.lottery.numPlayers();
            finalRounds--;
        }
        
        process.stdout.write(`lottery balance should be depleted:${await this.lottery.reward()}` + `\n`);
        
        expect(await this.lottery.reward()).to.equal(0);
        expect(await this.lottery.numPlayers()).to.equal(0);        
    });

    it("should display players/gamblers addresses and balances", async function () {                
        const admin: SignerWithAddress = this.signers.admin;
        const adminBalance = await hre.ethers.provider.getBalance(await admin.address);
        process.stdout.write(`${await admin.address}:${adminBalance}` + `\n`);
        for (let i = 0; i < this.gamblers.length; i++) {
            const g: SignerWithAddress = this.gamblers[i];
            process.stdout.write(`${await g.address}:${await g.getBalance()}` + `\n`);
        } 
    });
        
    it("should kill the lottery contract", async function () {        
        const tx = await this.lottery.connect(this.signers.admin).destroyLottery();
        const receipt = await tx.wait();
        const { to, from, gasUsed, transactionHash, blockNumber } = receipt;
        process.stdout.write(`(${blockNumber}) ${from} ➡️ Lottery:${to}` + `\n` +
            `\t` + `None transferred (⛽ ${gasUsed})` + `\n` +
            `\t` + `(${blockNumber}) ${transactionHash}` + `\n`
        );
    });

};
