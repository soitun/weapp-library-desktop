import Cookies from 'js-cookie';

const TokenKey = 'MANAGER_ID';

export function getId() {
  return Cookies.get(TokenKey, {path: 'manager'});
}

export function setId(token) {
  return Cookies.set(TokenKey, token, {path: 'manager'});
}

export function removeId() {
  return Cookies.remove(TokenKey, {path: 'manager'});
}