'use strict';

/***
 * Result of a GetChainTip request
 * @param obj
 * @returns {{height: *, hash: (obj.hash|*), branchLength: *, status: *, statusDescription: *}}
 * @constructor
 */
function ChainTip(obj) {
  return {
    height: obj.height,
    hash: obj.hash,
    branchLength: obj.branchlen,
    status: obj.status,
    statusDescription: (obj.status in ChainTip.STATUSES) ? ChainTip.STATUSES[obj.status] : 'Status unexpected'
  }
}

ChainTip.STATUSES = {
  invalid: 'This branch contains at least one invalid block',
  'headers-only': 'Not all blocks for this branch are available, but the headers are valid',
  'valid-headers': 'All blocks are available for this branch, but they were never fully validated',
  'valid-fork': 'This branch is not part of the active chain, but is fully validated',
  'active': 'This is the tip of the active main chain, which is certainly valid'
};

module.exports = ChainTip;
