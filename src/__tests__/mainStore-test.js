import { MainStore } from 'stores'
import { Temp } from 'classes'

describe('MainStore', () => {

  it('get temperatures', () => {
    expect(Array.isArray(MainStore.getTemperatures.toJS())).toBe(true)
  })

  it('Add temp', () => {
    MainStore.addTemp(10, 'TestLocation')
    const temps = MainStore.getTemperatures.toJS()
    const lastTemp = temps[temps.length ? temps.length - 1 : temps.length]
    expect(lastTemp).toEqual(new Temp(10, 'TestLocation'))
  })
})