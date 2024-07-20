import { ethers } from "hardhat";
import { Contract } from "ethers";
import { splitSignature } from "ethers/lib/utils";

async function main() {
    // Configurações iniciais
    const [owner, vaultAdmin, user] = await ethers.getSigners();

    // Endereço do contrato Vault e do token ERC20 com suporte a permit
    const vaultAddress = "0x4627faAcA6F70759669aF7C3D00292942AF68A62";
    const tokenAddress = "0x94a9D9AC8a22534E3FaCa9F4e7F2E2cf85d5E4C8";
    
    // ABI e configuração do contrato Vault e do token ERC20
    const Vault = await ethers.getContractFactory("Vault");
    const ERC20Permit = await ethers.getContractFactory("ERC20Permit"); // Supondo que seu token ERC20 suporta permit

    const vault: Contract = Vault.attach(vaultAddress);
    const token: Contract = ERC20Permit.attach(tokenAddress);

    // Valor do empréstimo e prazo
    const value = ethers.utils.parseUnits("100000", 6); // Valor do empréstimo em wei (ajustar conforme necessário)
    const deadline = Math.floor(Date.now() / 1000) + 60 * 20; // 20 minutos a partir de agora

    // Geração da assinatura permit
    const nonce = await token.nonces(owner.address);
    const chainId = await owner.getChainId();

    const domain = {
        name: await token.name(),
        version: '1',
        chainId,
        verifyingContract: token.address
    };

    const types = {
        Permit: [
            { name: 'owner', type: 'address' },
            { name: 'spender', type: 'address' },
            { name: 'value', type: 'uint256' },
            { name: 'nonce', type: 'uint256' },
            { name: 'deadline', type: 'uint256' }
        ]
    };

    const message = {
        owner: owner.address,
        spender: vaultAddress,
        value: value.toString(),
        nonce: nonce.toString(),
        deadline: deadline.toString()
    };

    const signature = await owner._signTypedData(domain, types, message);
    const { v, r, s } = splitSignature(signature);

    // Chamada da função tomaEmprestimo no contrato Vault
    const tx = await vault.connect(user).tomaEmprestimo(
        tokenAddress,
        value,
        deadline,
        v,
        r,
        s
    );

    await tx.wait();
    console.log("Empréstimo tomado com sucesso!");
}

main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});
