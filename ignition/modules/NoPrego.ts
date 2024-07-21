import { buildModule } from "@nomicfoundation/hardhat-ignition/modules";

const NoPregoModule = buildModule("NoPregoModule", (m) => {

  const NoPrego = m.contract("NoPrego");

  return { NoPrego };
});

export default NoPregoModule;
