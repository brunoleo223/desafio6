import { EntityRepository, Repository, getCustomRepository} from 'typeorm';

import Transaction from '../models/Transaction';

interface Balance {
  income: number;
  outcome: number;
  total: number;
}

@EntityRepository(Transaction)
class TransactionsRepository extends Repository<Transaction> {
  public async getBalance(): Promise<Balance> {
    const transactionRepository = getCustomRepository(TransactionsRepository);
    const transactions = await transactionRepository.find();
    const { income, outcome } = transactions.reduce(
      (acumulator: Balance, transaction: Transaction) => {
        if (transaction.type == 'income') {
          acumulator.income += transaction.value;
          acumulator.total += transaction.value;
        } else if (transaction.type == 'outcome') {
          acumulator.outcome += transaction.value;
          acumulator.total -= transaction.value;
        }
        return acumulator;
      },
      {
        income: 0,
        outcome: 0,
        total: 0
      }
      )

      const total = income - outcome;
      return { income, outcome, total };
    }
  }

  export default TransactionsRepository;
