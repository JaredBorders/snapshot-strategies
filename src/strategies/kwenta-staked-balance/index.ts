import { BigNumberish } from '@ethersproject/bignumber';
import { formatUnits } from '@ethersproject/units';
import { Multicaller } from '../../utils';

export const author = 'JaredBorders';
export const version = '0.1.0';

/**
 * balanceOf() -> returns the *total* amount of $KWENTA staked by the address
 * passed as an argument. This also includes staked escrow $KWENTA.
 *
 * link: https://github.com/Kwenta/token/blob/c36c589b5439d813ec0bd942c57f342b48f6c3cc/contracts/StakingRewards.sol#L168
 */
const abi = [
  'function balanceOf(address account) external view returns (uint256)'
];

export async function strategy(
  space,
  network,
  provider,
  addresses,
  options,
  snapshot
): Promise<Record<string, number>> {
  // if blockTag is *not* valid, just use latest block
  const blockTag = typeof snapshot === 'number' ? snapshot : 'latest';

  const multi = new Multicaller(network, provider, abi, { blockTag });
  addresses.forEach((address: any) =>
    multi.call(address, options.address, 'balanceOf', [address])
  );
  const result: Record<string, BigNumberish> = await multi.execute();

  return Object.fromEntries(
    Object.entries(result).map(([address, balance]) => [
      address,
      parseFloat(formatUnits(balance, 18))
    ])
  );
}
