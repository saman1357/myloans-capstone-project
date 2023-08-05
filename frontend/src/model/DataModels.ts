export type Loan={
    id: string,
    lenderId: string,
    borrowerId: string,
    itemId: string,
    description: string,
    amount: number,
    loanDate: string,
    returnDate: string
}

export type LoanWithoutId={
    lenderId: string,
    borrowerId: string,
    itemId: string,
    description: string,
    amount: number,
    loanDate: string,
    returnDate: string
}

export type Item={
    id: string,
    type: string
}

export type Person={
    id: string,
    name: string
}

export type PersonWithoutId={
    name: string
}

export type UserData={
    id: string,
    items: Item,
    persons: Person[],
    loans: Loan[]
}
