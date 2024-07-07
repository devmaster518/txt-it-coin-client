import { gql } from 'src/__generated__';

export const CONFIRM_STATISTICS_MUTATION = gql(/* GraphQL */ `
  mutation ConfirmStatistics($data: ConfirmStatistics!) {
    confirmStatistics(data: $data) {
      success
    }
  }
`);

export const FETCH_MEMBERSTATISTICS_QUERY = gql(/* GraphQL */ `
  query MemberStatistics($page: String, $filter: JSONObject, $sort: String) {
    memberStatistics(page: $page, filter: $filter, sort: $sort) {
      memberStatistics {
        id
        hashPower
        txcShared
        issuedAt
        percent
        createdAt
        updatedAt
        deletedAt
        member {
          username
          txcCold
          email
          assetId
        }
        statistics {
          newBlocks
          newHashPower
          status
        }
      }
      total
    }
  }
`);

export const FETCH_BLOCKS_QUERY = gql(/* GraphQL */ `
  query Blocks($page: String, $filter: JSONObject, $sort: String) {
    blocks(page: $page, filter: $filter, sort: $sort) {
      blocks {
        id
        blockNo
        hashRate
        difficulty
        createdAt
        updatedAt
        deletedAt
      }
      total
    }
  }
`);

export const FETCH_PENDING_STATISTICS_QUERY = gql(/* GraphQL */ `
  query PendingStatistics($page: String, $filter: JSONObject, $sort: String) {
    pendingStatistics(page: $page, filter: $filter, sort: $sort) {
      results {
        txcCold
        txcShared
      }
    }
  }
`);

// export const FETCH_STATISTICS_QUERY = gql(/* GraphQL */ `
//   query Statistics($page: String, $filter: JSONObject, $sort: String) {
//     statistics(page: $page, filter: $filter, sort: $sort) {
//       statistics {
//         id
//         newHashPower
//         totalHashPower
//         newBlocks
//         totalBlocks
//         members
//         issuedAt
//         from
//         to
//         status
//         createdAt
//         updatedAt
//         deletedAt
//         memberStatistics {
//           id
//           hashPower
//           txcShared
//           issuedAt
//           percent
//           createdAt
//           updatedAt
//           deletedAt
//           member {
//             id
//             username
//             txcCold
//             email
//             mobile
//           }
//         }
//       }
//       total
//     }
//   }
// `);

// export const FETCH_MEMBERS_COUNT = gql(/* GraphQL */ `
//   query Members($page: String, $filter: JSONObject, $sort: String) {
//     members(page: $page, filter: $filter, sort: $sort) {
//       total
//     }
//   }
// `);

// export const FETCH_MEMBERS_BY_DATE = gql(/* GraphQL */ `
//   query MembersGroupByDate($page: String, $filter: JSONObject, $sort: String) {
//     membersGroupByDate(page: $page, filter: $filter, sort: $sort) {
//       rates {
//         count
//         date
//       }
//       total
//     }
//   }
// `);
