import { observable, computed, action } from "mobx"

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

}

class Temp {
  @observable temperature = 0
  @observable location = ''

  @computed
  get getTemperature() {
    return this.temperature
  }

  constructor(temperature, location) {
    this.temperature = temperature
    this.location = location
  }

  @action
  upTemperature(e) {
    this.temperature++
  }

  @action
  downTemperature() {
    this.temperature--
  }

}