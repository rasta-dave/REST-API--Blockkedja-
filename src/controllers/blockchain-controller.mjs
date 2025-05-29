import { catchErrorAsync } from '../utilities/catchErrorAsync.mjs';
import BlockchainRepository from '../repositories/blockchain-repository.mjs';
import AppError from '../models/appError.mjs';

// Skapa en instans av blockchain repository
const blockchainRepo = new BlockchainRepository();

// Initialisera blockkedjan vid start
await blockchainRepo.initialize();

export const getBlockchain = catchErrorAsync(async (req, res) => {
  const chain = await blockchainRepo.getChain();
  res.status(200).json({
    success: true,
    length: chain.length,
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

  const newBlock = await blockchainRepo.addBlock(data);

  res.status(201).json({
    success: true,
    message: 'Block skapat och tillagt i blockkedjan',
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
