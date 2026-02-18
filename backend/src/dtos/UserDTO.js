export class UserCreateDTO {
  constructor({ name, email, gross_salary }) {
    this.name = name
    this.email = email
    this.gross_salary = gross_salary
  }
}

export class UserUpdateDTO {
  constructor({ name, gross_salary }) {
    this.name = name || undefined
    this.gross_salary = gross_salary || undefined
  }
}

export class UserResponseDTO {
  constructor(user) {
    this.id = user.id
    this.name = user.name
    this.email = user.email
    this.gross_salary = user.gross_salary
    this.created_at = user.created_at
  }
}
