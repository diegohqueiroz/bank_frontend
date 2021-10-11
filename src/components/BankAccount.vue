<template>
<!--   <div style="display:flex;"> -->

    <div class="col-12" style="padding-top: 20px">
      <div v-if="currentBankAccount">
        <div class="card">
          <div class="card-body">
            <h5 class="card-title">Conta bancária do banco: {{ currentBankAccount.bank.name }}</h5>
            <div class="row">
              <div class="col-6">
                <label><strong>Titular:</strong></label> {{ currentBankAccount.customer.name }}
              </div>
              <div class="col-6">
                <label><strong>Situação:</strong></label> {{ currentBankAccount.active == true ? "Ativa" : "Inativa" }}
              </div>
            </div>
            <div class="row">
              <div class="col-6">
                <label><strong>Agência:</strong></label>
                 {{ currentBankAccount.agency }}
              </div>
              <div class="col-6">
                <label><strong>Número:</strong></label> {{ currentBankAccount.number }}
              </div>
            </div>
            <div id="accordion">
              <div class="card">
                <div class="card-header" id="headingOne" style="justify-content: center;">
                  <h5 class="mb-0" style="justify-content: center;">
                    <button type="button" class="btn btn-secondary" data-toggle="collapse" data-target="#collapseOne" aria-expanded="false" aria-controls="collapseOne" @click="balance(currentBankAccount.id)" style="width: 150px">
                      {{ currentBalance == null ? 'Ver Saldo' : 'Ocultar Saldo' }}
                    </button>
                  </h5>
                </div>

                <div id="collapseOne" class="collapse" aria-labelledby="headingOne" data-parent="#accordion">
                  <div class="card-body">
                    <div class="row">
                      <div class="col-12" >
                        <div v-if="currentBalance">
                          <div class="row">
                            <div class="col-4">
                              <label><strong>Saldo:</strong></label> R$ {{ currentBalance.balance.toFixed(2) }}
                            </div>
                            <div class="col-8">
                              <label><strong>Data da consulta:</strong></label> {{ currentBalance.date_balance }}
                            </div>
                          </div>
                          <div class="row" style="justify-content: center; padding-top: 20px">
                            <button type="button" class="btn btn-secondary" @click="balance(currentBankAccount.id, true)" style="width: 150px;">
                              Atualizar Saldo
                            </button>
                          </div>
                          <div class="row" style="justify-content: center; padding-top: 20px">
                            <router-link :to="'/accounts/' + currentBankAccount.id + '/statement'" class="btn btn-secondary" style="width: 150px;">Ver Extrato</router-link>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div id="accordionMovement" v-if="currentBankAccount.active == 1">
              <div class="card">
                <div class="card-header" id="headingMovement">
                  <h5 class="mb-0">
                    <div class="row" style="padding-top: 20px;">
                      <div class="col-6" v-if="movement != 'in &&'">
                        <button type="button" class="btn btn-danger" @click="showWithdraw()" data-toggle="collapse" data-target="#collapseMovement" aria-expanded="false" aria-controls="collapseMovement" style="width: 90%">
                          {{ movement == null ? 'Sacar' : 'Voltar' }}
                        </button>
                      </div>
                      <div class="col-6" v-if="movement != 'out'">
                        <button type="button" class="btn btn-primary" @click="showDeposit()" data-toggle="collapse" data-target="#collapseMovement" aria-expanded="false" aria-controls="collapseMovement" style="width: 90%">
                          {{ movement == null ? 'Depositar' : 'Voltar' }}
                        </button>
                      </div>
                    </div>
                  </h5>
                </div>

                <div id="collapseMovement" class="collapse" aria-labelledby="headingMovement" data-parent="#accordionMovement">
                  <div class="card-body">
                    <div class="row">
                      <div class="col-12" style="padding-top: 20px">
                        <div v-if="movement" class="edit-form">
                          <h4>{{ movement == 'in' ? 'Depósitar' : 'Sacar' }}</h4>
                          <form>
                              <label for="movementValue">Informe o valor:</label>
                              <input type="number" class="form-control" id="movementValue" v-model="movementValue" min="0"/>
                              <div class="row" style="justify-content: center; padding-top: 20px">
                                <button type="button" class="btn btn-secondary" @click="confirmMovement()">
                                  Confirmar
                                </button>
                              </div>
                              <p>{{ message }}</p>
                          </form>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>
      </div>
      <div v-else>
        <br />
        <p>Conta inválida</p>
      </div>
<!--     </div> -->
  </div>
</template>

<script>
import BankAccountDataService from "../services/BankAccountDataService";
export default {
  name: "bankAccount",
  data() {
    return {
      currentBankAccount: null,
      currentBalance: null,
      message: '',
      movement: null,
      movementValue: 0
    };
  },
  methods: {
    get(id) {
      this.message = '';
      BankAccountDataService.find(id)
        .then(response => {
          this.currentBankAccount = response.data;
          console.log(response.data);
        })
        .catch(e => {
          console.log(e);
        });
    },
    balance(id, update = false){
      this.message = '';
      if(update || this.currentBalance == null){
        BankAccountDataService.balance(id)
          .then(response => {
            this.currentBalance = response.data;
            console.log(response.data);
          })
          .catch(e => {
            console.log(e);
          });
        }else{
          this.currentBalance = null;
        }
    },
    showDeposit(){
      this.message = '';
      if(this.movement == null)
        this.movement = 'in';
      else
        this.movement = null;
    },
    showWithdraw(){
      this.message = '';
      if(this.movement == null)
        this.movement = 'out';
      else
        this.movement = null;
    },
    confirmMovement(){
      if(this.movementValue <= 0){
        this.message = 'Informe um número válido';
        return;
      }
      let data = {
        movement: this.movement, 
        value: this.movementValue,
        bank_account_id: this.currentBankAccount.id};
      BankAccountDataService.movement(this.currentBankAccount.id, data)
        .then(response => {
          if(response.data.sucess){
            console.log(response.data);
            this.message = 'Transação realizada com sucesso!';
            this.$router.go(this.$router.currentRoute);
          }else{
            this.message = response.data.message;
          }
        })
        .catch(e => {
          console.log(e);
          this.message = 'Verifique se o saldo é suficiente';
        });

    },
  },
  mounted() {
    this.message = '';
    this.get(this.$route.params.id);
  }
};
</script>

<style>
.edit-form {
  /*max-width: 300px;*/
  margin: auto;
}
</style>