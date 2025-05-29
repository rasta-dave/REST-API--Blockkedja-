import express from 'express';
import {
  getBlockchain,
  getBlock,
  addBlock,
  validateChain,
} from '../controllers/blockchain-controller.mjs';

const blockchainRouter = express.Router();

blockchainRouter.route('/').get(getBlockchain).post(addBlock);
blockchainRouter.route('/validate').get(validateChain);

blockchainRouter.route('/:index').get(getBlock);

export default blockchainRouter;
