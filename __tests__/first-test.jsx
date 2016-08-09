//import TestUtils from "react-addons-test-utils"
import expect from 'expect'
import { Main } from 'components'

const TestUtils = React.addons.TestUtils

describe("Main", () => {
	it("Have h1", () => {
		const main = TestUtils.renderIntoDocument(<Main />)

		const h1 = TestUtils.findRenderedDOMComponentWithTag(main, 'h1')

		expect(h1.getDomNode().textContent).toEqual("This is h1")
	})
})