export type Loan={
    id: string,
    type: string,
    otherPartyId: string,
    itemId: string,
    description: string,
    amount: number,
    loanDate: string,
    returnDate: string
}

export type LoanWithoutId={
    type: string,
    otherPartyId: string,
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

export type UserWithoutId={
    username: string,
    password: string
}

export type UserWithoutPassword={
    id: string,
    username: string
}
