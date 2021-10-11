<template>
  <div class="list row">
    <div class="col-md-12">
      <div class="input-group mb-3">
        <input type="text" class="form-control" placeholder="Pesquisar"
          v-model="numberAccount"/>
        <div class="input-group-append">
          <button class="btn btn-outline-secondary" type="button"
            @click="searchNumber">
            Pesquisar
          </button>
        </div>
      </div>
    </div>
    <div class="col-md-12">
      <!-- <h4>Contas bancárias</h4> -->
      <div class="row">
        <div class="col-3">
          Agência
        </div>
        <div class="col-3">
          Conta
        </div>
        <div class="col-6">
          Titular
        </div>
      </div>
      <ul class="list-group">
        <li class="list-group-item"
          :class="{ active: index == currentIndex }"
          v-for="(bankaccount, index) in bankAccounts"
          :key="index"
          @click="setActive(bankaccount, index)">
            <div class="row">
              <div class="col-3">
                {{bankaccount.agency }}
              </div>
              <div class="col-3">
                {{bankaccount.number }}
              </div>
              <div class="col-6">
                {{ bankaccount.customer.name }}
              </div>
            </div>
          </li>
      </ul>

    </div>
    <div class="col-md-12" style="padding-top: 20px">
      <div v-if="currentBankAccount">
        <h4>Conta bancária selecionada</h4>
        <div>
          <label><strong>Titular:</strong></label> {{ currentBankAccount.customer.name }}
        </div>
        <div>
          <label><strong>Número:</strong></label> {{ currentBankAccount.number }}
        </div>
        <div>
          <label><strong>Agência:</strong></label> {{ currentBankAccount.agency }}
        </div>
        <div>
          <label><strong>Situação:</strong></label> {{ currentBankAccount.active ? "Ativa" : "Inativa" }}
        </div>
        <div style="text-align: center">
          <router-link :to="'/accounts/' + currentBankAccount.id" class="btn btn-primary" style="width: 150px;">Acessar</router-link>
        </div>
      </div>
      <div v-else>
        <br />
        <p>Selecione uma conta</p>
      </div>
    </div>
  </div>
</template>

<script>
import BankAccountDataService from "../services/BankAccountDataService";

export default {
  name: "bank-accounts-list",
  data() {
    return {
      bankAccounts: [],
      currentBankAccount: null,
      currentIndex: -1,
      numberAccount: "",
      actives: true
    };
  },
  methods: {
    retrieveBankAccounts() {
      BankAccountDataService.findAll(this.actives)
        .then(response => {
          this.bankAccounts = response.data;
          console.log(response.data);
        })
        .catch(e => {
          console.log(e);
        });
    },

    refreshList() {
      this.retrieveBankAccounts();
      this.currentBankAccount = null;
      this.currentIndex = -1;
    },

    setActive(bankaccount, index) {
      BankAccountDataService.find(bankaccount.id)
        .then(response => {
          this.currentBankAccount = response.data;
          this.currentIndex = bankaccount ? index : -1;
          //this.setActive(null);
          console.log(response.data);
        })
        .catch(e => {
          this.setActive(null);
          console.log(e);
        });

      //this.currentBankAccount = bankaccount;
    },
    
    searchNumber() {
      BankAccountDataService.findByNumber(this.numberAccount, this.actives)
        .then(response => {
          this.bankAccounts = response.data;
          this.setActive(null);
          console.log(response.data);
        })
        .catch(e => {
          console.log(e);
        });
    }
  },
  mounted() {
    this.retrieveBankAccounts();
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
