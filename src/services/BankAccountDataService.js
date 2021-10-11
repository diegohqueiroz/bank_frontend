import http from "../http-common";

class BankAccountDataService {
  findAll(active) {
    return http.get('/bank/accounts?active=' + active);
  }

  findByNumber(number, active) {
    return http.get('/bank/accounts?number=' + number + '&active=' + active);
  }

  find(id) {
    return http.get('/bank/accounts/' + id);
  }

  balance(id) {
    return http.get('/bank/accounts/' + id + '/balance');
  }
  
  statement(id) {
    return http.get('/bank/accounts/' + id + '/statement');
  }

  movement(id, data) {
    return http.put('/bank/accounts/' + id + '/movement', data);
  }
}

export default new BankAccountDataService();
