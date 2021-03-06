/* eslint-disable react/display-name, newline-per-chained-call */
import { expect } from 'chai';
import './browser';
import Adapter from 'enzyme-adapter-react-16';
import Enzyme, { mount } from 'enzyme';
Enzyme.configure({ adapter: new Adapter() });
import React from 'react';
import LineGraphDumb from '../src';
import RenderedLine from '../src/RenderedLine';
import Axes from '../src/Axes';

describe('<LineGraphDumb />', () => {
    const lines = [
        {
            key: 'line1',
            data: [[0, 0], [1, 1], [2, 1], [3, 5]],
            color: 'black',
            fill: true
        },
        {
            key: 'line2',
            data: [[3, 5], [-1, 2], [5, 7], [1, 1]],
            color: ([xVal, yVal], index) => ['black', 'green', 'yellow', 'purple'][
                ((xVal > 0) >> 0) + ((yVal > 0) >> 0) + index % 2
            ],
            strokeWidth: 3,
            fill: false,
            smooth: true
        },
        {
            key: 'line3',
            data: [[1, 5], [2, -6], [3, 10]],
            color: 'red',
            arrows: true
        }
    ];

    const props = {
        name: 'somename',
        width: 500,
        height: 300,
        lines,
        beforeLines: () => (
            <g><text>{'before lines'}</text></g>
        ),
        afterLines: () => (
            <g><text>{'after lines'}</text></g>
        ),
        beforeGraph: () => (
            <span>{'before graph'}</span>
        ),
        afterGraph: () => (
            <span>{'after graph'}</span>
        ),
        minX: -10,
        maxX: 10,
        minY: -10,
        maxY: 10,
        outerProperties: {
            foo: ({ width, height }) => width + height
        },
        svgProperties: {
            bar: ({ width, height }) => width - height
        },
        svgClasses: 'baz bak'
    };

    const wrapper = mount(<LineGraphDumb {...props} />);

    const graphContainer = wrapper.childAt(0).childAt(0);

    it('should render an outer <div />', () => {
        expect(graphContainer.is('div.graph-container.graph-somename')).to.equal(true);
        expect(graphContainer.props()).to.have.property('foo', 800);
        expect(graphContainer.children()).to.have.length(3);
    });

    it('should render before and after graph components', () => {
        expect(graphContainer.childAt(0).is('span')).to.equal(true);
        expect(graphContainer.childAt(0).text()).to.equal('before graph');

        expect(graphContainer.childAt(2).is('span')).to.equal(true);
        expect(graphContainer.childAt(2).text()).to.equal('after graph');
    });

    it('should render an <svg />', () => {
        expect(graphContainer.childAt(1).is('svg')).to.equal(true);
        expect(graphContainer.childAt(1).props()).to.deep.include({
            width: 500,
            height: 300,
            className: 'baz bak',
            bar: 200
        });
        expect(graphContainer.childAt(1).children()).to.have.length(6);
    });

    it('should render before and after graph lines components', () => {
        expect(graphContainer.childAt(1).childAt(0).is('g')).to.equal(true);
        expect(graphContainer.childAt(1).childAt(0).text()).to.equal('before lines');

        expect(graphContainer.childAt(1).childAt(5).is('g')).to.equal(true);
        expect(graphContainer.childAt(1).childAt(5).text()).to.equal('after lines');
    });

    it('should render axes', () => {
        expect(graphContainer.childAt(1).childAt(1).is(Axes)).to.equal(true);
    });

    it('should render graph lines', () => {
        expect(graphContainer.childAt(1).childAt(2).is(RenderedLine)).to.equal(true);
        expect(graphContainer.childAt(1).childAt(2).props()).to.deep.include({
            width: 500,
            height: 300,
            data: lines[0].data,
            color: 'black',
            minX: -10,
            maxX: 10,
            minY: -10,
            maxY: 10
        });

        expect(graphContainer.childAt(1).childAt(3).is(RenderedLine)).to.equal(true);
        expect(graphContainer.childAt(1).childAt(3).props()).to.deep.include({
            width: 500,
            height: 300,
            data: lines[1].data,
            color: lines[1].color,
            smooth: true,
            fill: false,
            minX: -10,
            maxX: 10,
            minY: -10,
            maxY: 10
        });

        expect(graphContainer.childAt(1).childAt(4).is(RenderedLine)).to.equal(true);
        expect(graphContainer.childAt(1).childAt(4).props()).to.deep.include({
            width: 500,
            height: 300,
            data: lines[2].data,
            color: 'red',
            arrows: true,
            minX: -10,
            maxX: 10,
            minY: -10,
            maxY: 10
        });
    });
});

