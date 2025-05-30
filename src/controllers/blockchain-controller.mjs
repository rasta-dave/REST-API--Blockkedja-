import { catchErrorAsync } from '../utilities/catchErrorAsync.mjs';
import BlockchainRepository from '../repositories/blockchain-repository.mjs';
import AppError from '../models/appError.mjs';
import Transaction from '../models/transaction.mjs';

const blockchainRepo = new BlockchainRepository();
await blockchainRepo.initialize();

export const getBlockchain = catchErrorAsync(async (req, res) => {
  const chain = await blockchainRepo.getChain();
  res.status(200).json({
    success: true,
    length: chain.length,
    difficulty: chain.length > 1 ? chain[1].difficulty : 2,
    data: chain,
  });
});

export const getBlock = catchErrorAsync(async (req, res, next) => {
  const index = parseInt(req.params.index);

  if (isNaN(index)) {
    return next(
      new AppError('Ogiltigt blockindex. Måste vara ett nummer.', 400)
    );
  }

  const block = await blockchainRepo.getBlock(index);

  if (!block) {
    return next(new AppError(`Block med index ${index} hittades inte.`, 404));
  }

  res.status(200).json({
    success: true,
    data: block,
  });
});

export const addBlock = catchErrorAsync(async (req, res, next) => {
  const { data } = req.body;

  if (!data) {
    return next(
      new AppError(
        'Data saknas. "data" är obligatoriskt för att skapa ett block.',
        400
      )
    );
  }

  const startTime = Date.now();
  const newBlock = await blockchainRepo.addBlock(data);
  const miningTime = Date.now() - startTime;

  res.status(201).json({
    success: true,
    message: 'Block skapat och tillagt i blockkedjan',
    miningTime: `${miningTime}ms`,
    data: newBlock,
  });
});

export const addTransaction = catchErrorAsync(async (req, res, next) => {
  const { from, to, amount, description } = req.body;

  if (!from || !to || !amount) {
    return next(
      new AppError('from, to och amount är obligatoriska fält.', 400)
    );
  }

  const transaction = new Transaction({ from, to, amount, description });

  if (!transaction.isValid()) {
    return next(new AppError('Ogiltig transaktion.', 400));
  }

  const startTime = Date.now();
  const newBlock = await blockchainRepo.addBlock(transaction);
  const miningTime = Date.now() - startTime;

  res.status(201).json({
    success: true,
    message: 'Transaktion skapad och tillagd i blockkedjan',
    miningTime: `${miningTime}ms`,
    data: newBlock,
  });
});

export const validateChain = catchErrorAsync(async (req, res) => {
  const isValid = await blockchainRepo.isChainValid();

  res.status(200).json({
    success: true,
    isValid,
  });
});
