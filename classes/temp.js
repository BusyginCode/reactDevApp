import { observable, computed, action } from "mobx"

export default class Temp {
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