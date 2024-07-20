import { buildModule } from "@nomicfoundation/hardhat-ignition/modules";

const NoPregoNFTModule = buildModule("NoPregoNFTModule", (m) => {

  const nopregonft = m.contract("NoPregoNFT");

  return { nopregonft };
});

export default NoPregoNFTModule;
