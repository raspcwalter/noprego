import { buildModule } from "@nomicfoundation/hardhat-ignition/modules";

const BRLtoUSDConverterModule = buildModule("BRLtoUSDConverterModule", (m) => {

  const BRLtoUSDConverter = m.contract("BRLtoUSDConverter");

  return { BRLtoUSDConverter };
});

export default BRLtoUSDConverterModule;
