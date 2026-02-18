export class ExpenseCreateDTO {
  constructor({
    user_id,
    description,
    amount,
    expense_type,
    category,
    expense_date
  }) {
    this.user_id = user_id
    this.description = description
    this.amount = amount
    this.expense_type = expense_type
    this.category = category
    this.expense_date = expense_date
  }
}

export class ExpenseUpdateDTO {
  constructor({
    description,
    amount,
    expense_type,
    category,
    expense_date
  }) {
    this.description = description || undefined
    this.amount = amount || undefined
    this.expense_type = expense_type || undefined
    this.category = category || undefined
    this.expense_date = expense_date || undefined
  }
}

export class ExpenseResponseDTO {
  constructor(expense) {
    this.id = expense.id
    this.user_id = expense.user_id
    this.description = expense.description
    this.amount = expense.amount
    this.expense_type = expense.expense_type
    this.category = expense.category
    this.expense_date = expense.expense_date
    this.created_at = expense.created_at
  }
}
