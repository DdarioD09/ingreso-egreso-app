export class User {
  static fromFirestore({ uid, name, email }: any) {
    return new User(uid, name, email);
  }

  constructor(
    public uid: string | undefined,
    public name: string,
    public email: string | null | undefined
  ) {}
}
