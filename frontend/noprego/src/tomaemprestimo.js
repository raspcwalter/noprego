const { ethers } = require("ethers");

async function getPermitSignature(signer, token, spender, value, deadline) {
    const nonce = await token.nonces(signer.address);
    const chainId = await signer.getChainId();

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
        owner: signer.address,
        spender,
        value,
        nonce: nonce.toHexString(),
        deadline: deadline.toHexString()
    };

    const signature = await signer._signTypedData(domain, types, message);
    const { v, r, s } = ethers.utils.splitSignature(signature);

    return { v, r, s };
}
