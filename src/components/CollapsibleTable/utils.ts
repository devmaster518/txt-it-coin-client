// ----------------------------------------------------------------------

export default function createData(
  issuedAt: string,
  totalBlocks: number,
  newBlocks: number,
  newHashPower: number,
  totalHashPower: number,
  members: number,
  from: string,
  to: string,
  status: boolean,
  memberStatistics: any[]
) {
  return {
    issuedAt,
    totalBlocks,
    newBlocks,
    newHashPower,
    totalHashPower,
    members,
    from,
    to,
    status,
    memberStatistics,
  };
}
