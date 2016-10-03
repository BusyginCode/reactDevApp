import { TestComponent, Root, Main } from 'components'
import { MainStore } from 'stores'
import { Temp } from 'classes'

let cur;

const titleCheck = (component, text) => {
  const h1 = TestUtils.findRenderedDOMComponentWithTag(
    cur, 'h1'
  );
  expect(h1.textContent).toEqual(text);
}

describe('TestComponent', () => {

  beforeEach((done) => {
    cur = TestUtils.renderIntoDocument(<TestComponent/>);
    done()
  });

  it('Does have h1', () => {
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
    expect(h1.style.color).toEqual("red");
  })

  it('Button click', () => {
    const node = TestUtils.findRenderedDOMComponentWithTag(cur, 'button')
    TestUtils.Simulate.click(node)
    titleCheck(cur, "New text!")
  })

});

let main = TestUtils.renderIntoDocument(<Main mainStore={MainStore}/>);

describe ('Main', () => {

  it('Add temperature', () => {
    const buttonComponent = TestUtils.findRenderedDOMComponentWithClass(main, 'addButtons')

    //console.log(Object.keys(TestUtils.Simulate))

    TestUtils.Simulate.click(buttonComponent)
    const temps = MainStore.getTemperatures.toJS()
    const lastTemp = temps[temps.length ? temps.length - 1 : temps.length]
    expect(lastTemp).toEqual(new Temp(0, 'Kiev'))
  })

  it('Test shallow', () => {
    const shallowRenderer = TestUtils.createRenderer();
    shallowRenderer.render(<TestComponent />);
    const component = shallowRenderer.getRenderOutput();
    //console.log(component.props.children)
    // expect(component.props.children).toEqual([
    //   <span className="heading">Title</span>,
    //   <Subcomponent foo="bar" />
    // ]);
  })

})

