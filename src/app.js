'use strict';

import xs from 'xstream';
import { run } from '@cycle/run';
import { div, h1, makeDOMDriver } from '@cycle/dom';
import isolate from '@cycle/isolate';
import { multiply, pow, round } from 'mathjs';
import { Slider } from './Slider';

run(main, {
  DOM: makeDOMDriver('#app')
});

function main (sources) {
  const heightSlider = Slider |> isolate |> invoke({
    DOM: sources.DOM,
    props: xs.of({
      _label: 'Height',
      unit: 'cm',
      min: 40,
      max: 210,
      value: 170
    })
  });
  const weightSlider = Slider |> isolate |> invoke({
    DOM: sources.DOM,
    props: xs.of({
      _label: 'Weight',
      unit: 'kg',
      min: 40,
      max: 120,
      value: 70
    })
  });

  const bmi$ = xs.combine(weightSlider.value, heightSlider.value)
    .map(([weight, height]) => weight / (height |> multiply(?, 0.01) |> pow(?, 2)) |> round)
    .remember();

  return {
    DOM: xs.combine(weightSlider.DOM, heightSlider.DOM, bmi$)
      .map(([weightSlider, heightSlider, bmi]) =>
        div([
          weightSlider,
          heightSlider,
          h1(`BMI is ${bmi}`)
        ]))
  };
}

function debug (label) {
  console.debug(label + ': ', this);
  return this;
}

function invoke (...args) {
  return function (caller) {
    return caller(...args);
  };
}
