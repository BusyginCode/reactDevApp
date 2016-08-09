import { TestComponent, Root } from 'components'
import TestUtils from 'react-addons-test-utils'

let cur;

const titleCheck = (component, text) => {
  const h1 = TestUtils.findRenderedDOMComponentWithTag(
    cur, 'h1'
  );
  expect(h1.textContent).toEqual(text);
}

describe('TestComponent', function () {

  beforeEach((done) => {
    cur = TestUtils.renderIntoDocument(<TestComponent/>);
    done()
  });

  it('Does have h1', function () {
    titleCheck(cur, "Old text")
  });

  it('Is testComponent', () => {
    expect(true).toEqual(TestUtils.isElement(<TestComponent/>))
    expect(true).toEqual(TestUtils.isElementOfType(<TestComponent/>, TestComponent))
  });

  it('focus simulate', () => {
    const node = TestUtils.findRenderedDOMComponentWithTag(cur, 'button')
    TestUtils.Simulate.focus(node)
    const h1 = TestUtils.findRenderedDOMComponentWithTag(
      cur, 'h1'
    );
    alert(h1)
    expect(h1.style.color).toEqual("red");
  })

  it('Button click', () => {
    const node = TestUtils.findRenderedDOMComponentWithTag(cur, 'button')
    TestUtils.Simulate.click(node)
    titleCheck(cur, "New text!")
  })

});

