import express from 'express';
import {
  getBlockchain,
  getBlock,
  addBlock,
  addTransaction,
  validateChain,
} from '../controllers/blockchain-controller.mjs';

const blockchainRouter = express.Router();

blockchainRouter.route('/').get(getBlockchain).post(addBlock);
blockchainRouter.route('/validate').get(validateChain);
blockchainRouter.route('/transaction').post(addTransaction);
blockchainRouter.route('/:index').get(getBlock);

export default blockchainRouter;
