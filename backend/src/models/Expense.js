import { DataTypes } from 'sequelize'
import sequelize from '../database/connection.js'

const EXPENSE_TYPES = {
  CREDIT_CARD: 'CREDIT_CARD',
  MONTHLY: 'MONTHLY',
  PIX_DEBIT: 'PIX_DEBIT'
}

const Expense = sequelize.define(
  'Expense',
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true
    },
    user_id: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: 'users',
        key: 'id'
      }
    },
    description: {
      type: DataTypes.STRING(255),
      allowNull: false,
      validate: {
        notEmpty: true
      }
    },
    amount: {
      type: DataTypes.DECIMAL(15, 2),
      allowNull: false,
      validate: {
        min: 0
      }
    },
    expense_type: {
      type: DataTypes.ENUM(Object.values(EXPENSE_TYPES)),
      defaultValue: EXPENSE_TYPES.PIX_DEBIT,
      allowNull: false
    },
    category: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    expense_date: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW
    },
    created_at: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW
    }
  },
  {
    tableName: 'expenses',
    timestamps: false
  }
)

export { Expense, EXPENSE_TYPES }
export default Expense
