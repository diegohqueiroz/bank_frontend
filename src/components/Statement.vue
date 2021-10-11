<template>
  <div class="list row">
    <div class="col-md-12">
      <ul class="list-group">
        <li class="list-group-item">
          <div class="row">
            <div class="col-3">
              Data
            </div>
            <div class="col-3">
              Valor
            </div>
            <div class="col-3">
              Tipo
            </div>
            <div class="col-3">
              Saldo
            </div>
          </div>
        </li>
        <li class="list-group-item"
          :class="{ active: index == currentIndex }"
          v-for="(statement, index) in statements"
          :key="index">
            <div class="row">
              <div class="col-3">
                {{statement.date_balance }}
              </div>
              <div class="col-3">
                R$ {{statement.value }}
              </div>
              <div class="col-3">
                <label v-if="statement.type == 'in'" class="text-primary">{{ 'Depósito' }}</label>
                <label v-else class="text-danger">{{ 'Saque' }}</label>
              </div>
              <div class="col-3">
                R$ {{ statement.later_balance }}
              </div>
            </div>
          </li>
      </ul>
    </div>
  </div>
</template>

<script>
import BankAccountDataService from "../services/BankAccountDataService";

export default {
  name: "bank-accounts-list",
  data() {
    return {
      statements: [],
      actives: true
    };
  },
  methods: {
    retrieveStatement() {
      BankAccountDataService.statement(this.$route.params.id)
        .then(response => {
          //response
          this.statements = response.data;
          console.log(response.data);
          console.log(response);
        })
        .catch(e => {
          console.log(e);
        });
    },
  },
  mounted() {
    this.retrieveStatement();
  }
};
</script>

<style>
.list {
  text-align: left;
  max-width: 900px;
  margin: auto;
}
</style>
