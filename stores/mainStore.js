import { observable, computed, action } from "mobx"
import { Temp } from 'classes'
export default new class MainStore {

  @observable temp = []

  @computed
  get getTemperatures() {
    return this.temp
  }

  @action
  addTemp(temp, loc) {
    this.temp.push(new Temp(temp, loc))
  }

  @action
  clearStore() {
  	this.temp = []
  }
}

