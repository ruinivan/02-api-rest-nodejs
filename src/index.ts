interface User {
  birthYear: number;
}

function calcularAIdadeDoUsuario(user: User) {
  return new Date().getFullYear() - user.birthYear;
}

calcularAIdadeDoUsuario({
  birthYear: 2005,
});
